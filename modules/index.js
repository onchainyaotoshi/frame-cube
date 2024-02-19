import { fileURLToPath } from 'url';
import path , { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

import express from 'express';
const router = express.Router({ mergeParams: true });
router.get("/", (req, res) => {
  res.render('index', {
    title: "Rubic's Cube",
    image: `https://${process.env.NGROK_DOMAIN}/images/main.png`,
    postUrl: `https://${process.env.NGROK_DOMAIN}/rubic`,
    buttons: [
      { text: "Let's solve it"},
    ]
  });
});

export default router;