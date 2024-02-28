import { renderFrame } from '@utils/render-frame.js';
import Rubik from '@utils/rubik/rubik.js';
import User from '@models/user.js';
import Session from '@models/session.js';
import Move from '@models/move.js';
import WelcomeAirdrop from '@models/welcome-airdrop.js';
import {getTokenReward, sendErc20} from '@utils/wallet/index.js';

const getOrCreateRubikSession = async(req)=>{
    await User.createIfNotExists(req.fc.neynar.postData.fid);
    let session = await Session.findActiveByFid(req.fc.neynar.postData.fid);
    let rubik;
    if(!session){
        rubik = new Rubik();
        session = await Session.create({
            fid:req.fc.neynar.postData.fid,
            startTime:req.fc.neynar.postData.action.timestamp,
            initialState:rubik.toString()
        });
    }else{
        rubik = new Rubik(session.current_state);
    }

    return {session,rubik}
}

const renderFrameUnsolvedRubik = async (res, rubik)=>{
    renderFrame(res, {
        image: rubik.renderToBase64(),
        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/run`,
        buttons: [
            { text: "Run" },
            // { text: "x - rotate ↑" },
            // { text: "y - rotate ←" },
            // { text: "x - rotate ↻" },
        ],
        input: { placeholder: "Singmaster Notation where c: counter-clockwise, t: twice" }
      });
}

export const startSession = async (req, res, next) => {
    try {
        let {session, rubik} = await getOrCreateRubikSession(req);

        renderFrameUnsolvedRubik(res, rubik);
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
                const beforeState = rubik.toString();
                const valid = rubik.move(moves[i]);
                if(valid){
                    await Move.create({
                        sessionId:session.session_id,
                        moveNotation:moves[i],
                        fromState:beforeState,
                        toState:rubik.toString(),
                        moveTimestamp:req.fc.neynar.postData.action.timestamp
                    });
                }
            }

            await Session.updateCurrentState(session.session_id,rubik.toString());
            if(!rubik.isSolved()){
                renderFrameUnsolvedRubik(res, rubik);
            }else{
                await Session.markSessionAsCompleted(session.session_id,req.fc.neynar.postData.action.timestamp);
                if(!(await WelcomeAirdrop.findByFid(req.fc.neynar.postData.fid))){
                    //belum claim
                    renderFrame(res, {
                        image: `${process.env.FC_DOMAIN}/images/alert-congrat.png`,
                        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/claim/${Session.session_id}`,
                        buttons: [
                            { text: "Claim Reward" },
                        ]
                    });
                }else{
                    //sudah claim
                    renderFrame(res, {
                        image: `${process.env.FC_DOMAIN}/images/alert-oneperwallet.png`,
                        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
                        buttons: [
                            { text: "Play again?" },
                        ]
                    });
                }
            }
        }
    } catch (error) {
        next(error);
    }
};

export const claim = async (req, res, next) => {
    try{
        const { id } = req.params;

        if(!await Session.find(req.fc.neynar.postData.fid,id)){
            throw new Error('session id not exists');
        }

        let to = null;
        try{
            to = req.fc.neynar.postData.action.interactor.verified_addresses.eth_addresses[0];
        }catch(err){
            //user dont set his eth address on his farcaster account yet
        }

        const token = await getTokenReward();

        await WelcomeAirdrop.create({
            fid:req.fc.neynar.postData.fid,
            token:token,
            amount:10000,
            address:to,
            session_id:id
        });

        sendErc20(token, to, "10000");

        renderFrame(res, {
            image: `${process.env.FC_DOMAIN}/images/alert-claim.png`,
            postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
            buttons: [
                { text: "Play again?" },
                { text: "Transactions", action: "link", target: `${process.env.FC_BLOCK_EXPLORER_URL}/address/${process.env.FC_WALLET_ADDRESS}` }
            ]
        });

    }catch(error){
        console.log(error)
        next(error);
    }
}
