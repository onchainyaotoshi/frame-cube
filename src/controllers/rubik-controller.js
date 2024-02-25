import { renderFrame } from '@utils/render-frame.js';
import Rubik from '@utils/rubik/rubik.js';
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
            startTime:fc.neynar.postData.action.timestamp,
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
            image: rubik.view.renderToBase64(),
            postUrl: `${process.env.FC_DOMAIN}/rubik/run`,
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
        if (req.action.tapped_button.index === 1) {
            const moves = req.action.input.text.trim().split(" ").map(v => v.trim());
            const tmpState = rubik.state.toString();
            for(let i=0;i<moves.length;i++){
                const valid = rubik.state.moveActions.executeMove(moves[i], moves[i].length == 2 && moves[i][1] == "'");
                if(valid){
                    await Move.create({
                        sessionId:session.session_id,
                        moveNotation:moves[i],
                        fromState:tmpState,
                        toState:rubik.state.toString(),
                        moveTimestamp:fc.neynar.postData.action.timestamp
                    });
                }
            }

            await Move.updateCurrentState(session.session_id,rubik.state.toString());
    
            if(!rubik.state.isSolved()){
                renderFrame(res, {
                    image: rubik.view.renderToBase64(),
                    postUrl: `${process.env.FC_DOMAIN}/rubik/run`,
                    buttons: [
                        { text: "Run" },
                    ],
                    input: { placeholder: "Singmaster Notation" }
                });
            }else{
                await Move.markSessionAsCompleted(session.session_id,fc.neynar.postData.action.timestamp);
                renderFrame(res, {
                    image: rubik.view.renderToBase64(),
                    postUrl: `${process.env.FC_DOMAIN}/rubik/start`,
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

