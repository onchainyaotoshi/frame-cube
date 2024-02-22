import express from 'express';
import {validateFramePost} from "../middleware.js";

const router = express.Router({ mergeParams: true });
router.get("/", validateFramePost,(req, res) => {
  res.render('index', {
    title: "Rubic's Cube",
    image: `${process.env.FC_DOMAIN}/images/main.png`,
    postUrl: `${process.env.FC_DOMAIN}/rubic/0`,
    buttons: [
      { text: "Let's solve it"},
    ]
  });
});

export default router;