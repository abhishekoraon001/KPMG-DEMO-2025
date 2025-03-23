const express = require('express');
const { ocrController } = require('../controllers/ocrcontroller');
const { formparserController } = require('../controllers/formparsercontroller');
const multer = require('multer');
const { downloadController } = require('../controllers/downloadController');
const { awsController } = require('../controllers/awsController');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit for PDF uploads
});

const router = express.Router();

router.post('/ocr', upload.single('image'), ocrController);
router.post('/formparse', upload.single('image'), formparserController);
router.get('/download', awsController);
router.get('/files/:filename',downloadController);
router.get('/health', (req, res) => {
   
    res.status(200).json({ message: 'API is working!',
    });
});
module.exports = router;