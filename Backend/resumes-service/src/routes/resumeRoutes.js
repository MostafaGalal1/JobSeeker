const express = require('express');
const multer = require('multer');
const { uploadResume } = require('../controllers/resumeControllers');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', ClerkExpressRequireAuth(), upload.single('resume'), uploadResume);

module.exports = router;