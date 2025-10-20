import express from 'express';
import { saveSubmission } from '../controllers/submission.controllers';

const router = express.Router();

router.post('/', saveSubmission);

export default router;
