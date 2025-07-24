const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:filename', (req, res) => {
  // Filename
  const filename = req.params.filename;

  // Absolute file path to the image inside uploads/images
  const filePath = path.join(__dirname, '..', 'uploads', 'images', filename);

  // Download the file
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('[DOWNLOAD ERROR]', err.message);
      res.status(404).send('File not found');
    }
  });
});


module.exports = router;
