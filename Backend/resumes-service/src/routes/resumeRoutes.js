const express = require('express');
const multer = require('multer');
const { uploadResume } = require('../controllers/resumeControllers');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /resumes/upload:
 *   post:
 *     summary: Upload a resume
 *     description: Upload a resume file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post('/upload', ClerkExpressRequireAuth(), upload.single('resume'), uploadResume);

module.exports = router;