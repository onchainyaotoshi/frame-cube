import express from 'express';
import RubikRoute from '@routes/rubik-route.js';

import { frameController } from '@controllers/frame-controller.js';
import { homeController } from '@controllers/home-controller.js';

const router = express.Router();

router.get('/', homeController);
router.post('/', frameController);
router.use('/rubik',RubikRoute);

export default router;