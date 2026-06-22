exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // req.file.path contains the cloudinary URL
    res.status(200).json({ url: req.file.path, message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};
