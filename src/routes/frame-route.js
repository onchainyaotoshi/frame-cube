import express from 'express';
import RubikRoute from '@routes/rubik-route.js';

import { frameController } from '@controllers/frame-controller.js';

const router = express.Router();

router.get('/', frameController);
router.post('/', frameController);
router.use('/rubik',RubikRoute);

export default router;