import express from 'express';

const router = express.Router({ mergeParams: true });
router.get("/",(req, res) => {
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