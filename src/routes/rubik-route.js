import express from 'express';
import { startSession, runMove, claim, leaderboard, myscore  } from '@controllers/rubik-controller.js';

import {validateFrameAction} from '@middlewares/neynar.js';

const router = express.Router();

router.post("/start", validateFrameAction, startSession);
router.post("/run", validateFrameAction, runMove);
router.post("/claim/:id", validateFrameAction, claim);
router.post("/leaderboard", validateFrameAction, leaderboard);
router.post("/myscore", validateFrameAction, myscore);

export default router;