import { renderFrame } from '@utils/render-frame.js';

export const frameController = async (req, res, next) => {
    try {
        console.log(`${process.env.FC_DOMAIN}/images/main.png`);
        renderFrame(res, {
            image: `${process.env.FC_DOMAIN}/images/main.png`,
            postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
            buttons: [
                { text: "Let's play" },
            ]
        });
    } catch (error) {
        next(error);
    }
};