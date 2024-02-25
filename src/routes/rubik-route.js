import express from 'express';
import { startSession, runMove  } from '@controllers/rubik-controller.js';

import {validateFrameAction} from '@middlewares/neynar.js';

const router = express.Router();

router.post("/start", validateFrameAction, startSession);
router.post("/run", validateFrameAction, runMove);

export default router;