import { renderFrame } from '@utils/render-frame.js';

export const renderFrameHome = (res)=>{
    renderFrame(res, {
        image: `${process.env.FC_DOMAIN}/images/main.png`,
        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
        buttons: [
            { text: "Let's play" },
            { text: "Leaderboard", target:`${process.env.FC_DOMAIN}/frame/rubik/leaderboard` },
            { text: "Fastest Solve", target:`${process.env.FC_DOMAIN}/frame/rubik/myscore` },
            { text: "Guide", action:"link", target:`https://github.com/onchainyaotoshi/frame-cube#frame-cube` },
        ]
    });
}

export const frameController = async (req, res, next) => {
    try {
        return renderFrameHome(res);
    } catch (error) {
        next(error);
    }
};