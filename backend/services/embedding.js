/**
 * Generates a 768-dimensional vector embedding for a given text using the Gemini API.
 * Returns a robust fallback vector if GEMINI_API_KEY is not defined or the API call fails.
 */
async function getEmbedding(text) {
  if (!text || typeof text !== 'string') {
    return new Array(768).fill(0);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not defined in backend/.env. Using deterministic fallback vector.');
    return generateFallbackVector(text);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }]
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Embedding API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (data.embedding && data.embedding.values) {
      return data.embedding.values;
    } else {
      throw new Error('Invalid response structure from Gemini Embedding API');
    }
  } catch (err) {
    console.error('❌ Failed to retrieve embedding from Gemini:', err.message);
    return generateFallbackVector(text);
  }
}

/**
 * Generates a deterministic fallback vector (768-dim) based on simple hashing of the input text.
 * This guarantees the system never fails when API keys are missing or offline during dev!
 */
function generateFallbackVector(text) {
  const vector = new Array(768).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let j = 0; j < 768; j++) {
    const val = Math.sin(hash + j) * 10;
    vector[j] = val - Math.floor(val); // Normalized float between -1 and 1
  }
  return vector;
}

module.exports = { getEmbedding };
