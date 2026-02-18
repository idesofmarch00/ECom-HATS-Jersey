const { Product } = require('../model/Product');
const { cloudinary } = require('../services/cloudinary');

exports.handleWhatsappWebhook = async (req, res) => {
  try {
    const numMedia = parseInt(req.body.NumMedia || '0', 10);
    const mediaUrl = req.body.MediaUrl0;

    if (numMedia > 0 && mediaUrl) {
      console.log(`📸 WhatsApp media received: ${mediaUrl}`);

      // 1. Upload remote media from Twilio to Cloudinary
      let uploadResult;
      try {
        uploadResult = await cloudinary.uploader.upload(mediaUrl, {
          folder: 'ecom-hats-jersey',
        });
      } catch (uploadErr) {
        console.error('Cloudinary upload failed for WhatsApp media:', uploadErr);
        res.type('text/xml');
        return res.send(`
          <Response>
            <Message>❌ Error: Failed to upload image to Cloudinary. Please try again.</Message>
          </Response>
        `);
      }

      const imageUrl = uploadResult.secure_url;
      console.log(`☁️ Cloudinary upload successful: ${imageUrl}`);

      // 2. Parse details using Gemini Vision (if API key available)
      let aiResult = null;
      if (process.env.GEMINI_API_KEY) {
        try {
          console.log('🤖 Parsing image with Gemini 1.5 Flash Vision...');
          const imgRes = await fetch(mediaUrl);
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');
          const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
          const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: "You are an expert e-commerce catalog manager. Analyze this image of a hat, cap, or sports jersey and extract the product information. Return the response strictly as a JSON object with the following fields: 'title' (a highly appealing name), 'description' (a rich and engaging e-commerce product description), 'category' (must be exactly one of: 'caps', 'hats', 'snapbacks', 'jerseys'), 'brand' (must be exactly one of: 'Nike', 'Adidas', 'New Era', 'Mitchell & Ness', 'Jordan'), 'price' (a premium integer price between 20 and 150), 'colors' (an array of strings matching the colors visible in the image, e.g. ['Black', 'Red']), 'sizes' (an array of strings, e.g. ['S', 'M', 'L', 'XL'] or ['One Size'] for caps)."
                    },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Image
                      }
                    }
                  ]
                }
              ],
              generationConfig: { responseMimeType: "application/json" }
            })
          });

          const geminiData = await response.json();
          if (geminiData.candidates && geminiData.candidates[0]?.content?.parts[0]?.text) {
            const textResponse = geminiData.candidates[0].content.parts[0].text;
            aiResult = JSON.parse(textResponse);
            console.log('✅ Gemini parsing successful:', aiResult);
          }
        } catch (geminiErr) {
          console.error('Gemini vision parsing failed, falling back to heuristics:', geminiErr);
        }
      }

      // Fallback heuristics if Gemini was unavailable/errored
      if (!aiResult) {
        console.log('⚠️ Falling back to default heuristics for WhatsApp product...');
        const userMsg = (req.body.Body || '').toLowerCase();
        const isJersey = userMsg.includes('jersey') || userMsg.includes('shirt') || userMsg.includes('tshirt') || userMsg.includes('cup') || userMsg.includes('team');

        if (isJersey) {
          aiResult = {
            title: `Custom Sports Jersey ${Date.now().toString().slice(-4)}`,
            description: `High-performance breathable team jersey crafted for elite players and fans alike. Engineered with sweat-wicking materials and modern sports aesthetics.`,
            category: 'jerseys',
            brand: 'Nike',
            price: 90,
            colors: ['Blue', 'White'],
            sizes: ['S', 'M', 'L', 'XL']
          };
        } else {
          aiResult = {
            title: `Premium Structured Cap ${Date.now().toString().slice(-4)}`,
            description: `Classic high-profile six-panel athletic cap. Features premium embroidered details, a pre-curved visor, and an adjustable strapback design.`,
            category: 'caps',
            brand: 'New Era',
            price: 32,
            colors: ['Black'],
            sizes: ['One Size']
          };
        }
      }

      // 3. Map colors and sizes to frontend-compatible objects
      const AVAILABLE_COLORS = [
        { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400', id: 'white' },
        { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400', id: 'gray' },
        { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900', id: 'black' },
        { name: 'Navy', class: 'bg-blue-900', selectedClass: 'ring-blue-900', id: 'navy' },
        { name: 'Red', class: 'bg-red-600', selectedClass: 'ring-red-600', id: 'red' },
        { name: 'Blue', class: 'bg-blue-600', selectedClass: 'ring-blue-600', id: 'blue' }
      ];

      const AVAILABLE_SIZES = [
        { name: 'XXS', inStock: true, id: 'xxs' },
        { name: 'XS', inStock: true, id: 'xs' },
        { name: 'S', inStock: true, id: 's' },
        { name: 'M', inStock: true, id: 'm' },
        { name: 'L', inStock: true, id: 'l' },
        { name: 'XL', inStock: true, id: 'xl' },
        { name: '2XL', inStock: true, id: '2xl' },
        { name: '3XL', inStock: true, id: '3xl' },
        { name: 'One Size', inStock: true, id: 'onesize' }
      ];

      function mapColors(colorNames) {
        if (!colorNames || !Array.isArray(colorNames)) return [];
        return colorNames.map(name => {
          const lowercase = name.toLowerCase().split('/')[0].trim();
          const found = AVAILABLE_COLORS.find(c => c.id === lowercase || c.name.toLowerCase() === lowercase);
          return found || { name, class: 'bg-gray-500', selectedClass: 'ring-gray-500', id: lowercase };
        });
      }

      function mapSizes(sizeNames) {
        if (!sizeNames || !Array.isArray(sizeNames)) return [];
        return sizeNames.map(name => {
          const lowercase = name.toLowerCase().replace(/\s+/g, '');
          const found = AVAILABLE_SIZES.find(s => s.id === lowercase || s.name.toLowerCase() === lowercase);
          return found || { name, inStock: true, id: lowercase };
        });
      }

      const finalPrice = Math.round(aiResult.price || 45);
      const finalDiscountPercentage = 10;
      const finalDiscountPrice = Math.round(finalPrice * (1 - finalDiscountPercentage / 100));

      // 4. Create and Save the product
      const { getEmbedding } = require('../services/embedding');
      let embeddingVector = [];
      try {
        const textToEmbed = `${aiResult.title} ${aiResult.description} ${aiResult.brand || ''} ${aiResult.category || ''}`;
        embeddingVector = await getEmbedding(textToEmbed);
      } catch (embedErr) {
        console.error('Failed to generate embedding in WhatsApp creation:', embedErr);
      }

      const product = new Product({
        title: aiResult.title,
        description: aiResult.description,
        price: finalPrice,
        discountPercentage: finalDiscountPercentage,
        discountPrice: finalDiscountPrice,
        rating: 4.5,
        stock: 50,
        brand: aiResult.brand || 'Nike',
        category: aiResult.category || 'jerseys',
        thumbnail: imageUrl,
        images: [imageUrl, imageUrl],
        colors: mapColors(aiResult.colors),
        sizes: mapSizes(aiResult.sizes),
        embedding: embeddingVector
      });

      const savedProduct = await product.save();
      console.log(`🛍️ Product successfully created via WhatsApp: ${savedProduct.title}`);

      // 5. Respond with Twilio TwiML message
      res.type('text/xml');
      return res.send(`
        <Response>
          <Message>🎉 SUCCESS! 🛍️ Product Created:\n\n*Title:* ${savedProduct.title}\n*Category:* ${savedProduct.category}\n*Brand:* ${savedProduct.brand}\n*Price:* $${savedProduct.price}\n\nIt is now live on our ECom HATS Jersey storefront! 🚀</Message>
        </Response>
      `);
    }

    // Default response if no media was sent
    res.type('text/xml');
    return res.send(`
      <Response>
        <Message>Welcome to ECom HATS Jersey WhatsApp AI Bot! 🧢👕\n\nTo add a new premium Hat or Jersey to the store, simply send me a *photo* of the item. Our AI will automatically:\n1. Upload the image to Cloudinary\n2. Auto-generate a premium title, description, category, and brand\n3. Set a premium price and list it live on the storefront! 🚀\n\nGive it a try by sending a photo! 📸</Message>
      </Response>
    `);
  } catch (err) {
    console.error('WhatsApp Webhook error:', err);
    res.type('text/xml');
    return res.send(`
      <Response>
        <Message>❌ Error: An internal error occurred while parsing your request. Please try again later.</Message>
      </Response>
    `);
  }
};
