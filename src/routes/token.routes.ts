import { Router } from 'express';
import { getToken } from '../controllers/token.controllers';

const router = Router();

router.get('/', getToken);

export default router;
