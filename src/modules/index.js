import express from 'express';

const router = express.Router({ mergeParams: true });
router.get("/",(req, res) => {
  Home(req,res);
});

export default router;

export const Home = (req,res)=>{
  res.render('index', {
    title: "Rubic's Cube",
    image: `${process.env.FC_DOMAIN}/images/main.png`,
    postUrl: `${process.env.FC_DOMAIN}/rubic/0`,
    buttons: [
      { text: "Let's play"},
    ]
  });
}