import { renderFrame } from '@utils/render-frame.js';

export const frameController = async (req, res, next) => {
    try {
        renderFrame(res, {
            image: `${process.env.FC_DOMAIN}/images/main.png`,
            postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
            buttons: [
                { text: "Let's play" },
                { text: "Leaderboard", target:`${process.env.FC_DOMAIN}/frame/rubik/leaderboard` },
            ]
        });
    } catch (error) {
        next(error);
    }
};