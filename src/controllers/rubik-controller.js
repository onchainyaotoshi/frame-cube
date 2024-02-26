import { renderFrame } from '@utils/render-frame.js';
import Rubik from '@utils/rubik/rubik.js';
import logger from '@utils/logger.js';
import User from '@models/user.js';
import Session from '@models/session.js';
import Move from '@models/move.js';

const getOrCreateRubikSession = async(req)=>{
    await User.createIfNotExists(req.fc.neynar.postData.fid);
    let session = await Session.findActiveByFid(req.fc.neynar.postData.fid);
    let rubik;
    if(!session){
        rubik = new Rubik();
        session = await Session.create({
            fid:req.fc.neynar.postData.fid,
            startTime:req.fc.neynar.postData.action.timestamp,
            initialState:rubik.state.toString()
        });
    }else{
        rubik = new Rubik(session.current_state);
    }

    return {session,rubik}
}

export const startSession = async (req, res, next) => {
    try {
        let {session, rubik} = await getOrCreateRubikSession(req);

        renderFrame(res, {
            image: rubik.renderToBase64(),
            postUrl: `${process.env.FC_DOMAIN}/frame/rubik/run`,
            buttons: [
                { text: "Run" },
            ],
            input: { placeholder: "Singmaster Notation" }
          });
    } catch (error) {
        next(error);
    }
};

export const runMove = async (req, res, next) => {
    try {
        let {session, rubik} = await getOrCreateRubikSession(req);
        if (req.fc.neynar.postData.action.tapped_button.index === 1) {
            const moves = req.fc.neynar.postData.action.input.text.trim().split(" ").map(v => v.trim());
            for(let i=0;i<moves.length;i++){
                const beforeState = rubik.state.toString();
                const valid = rubik.state.moveActions.executeMove(moves[i]);
                if(valid){
                    await Move.create({
                        sessionId:session.session_id,
                        moveNotation:moves[i],
                        fromState:beforeState,
                        toState:rubik.state.toString(),
                        moveTimestamp:req.fc.neynar.postData.action.timestamp
                    });
                }
            }

            await Session.updateCurrentState(session.session_id,rubik.state.toString());
            if(!rubik.state.isSolved()){
                renderFrame(res, {
                    image: rubik.renderToBase64(),
                    postUrl: `${process.env.FC_DOMAIN}/frame/rubik/run`,
                    buttons: [
                        { text: "Run" },
                    ],
                    input: { placeholder: "Singmaster Notation" }
                });
            }else{
                await Move.markSessionAsCompleted(session.session_id,req.fc.neynar.postData.action.timestamp);
                renderFrame(res, {
                    image: rubik.renderToBase64(),
                    postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
                    buttons: [
                        { text: "Play Again ?" },
                    ]
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

