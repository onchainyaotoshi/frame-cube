import { renderFrame } from '@utils/render-frame.js';
import Rubik from '@utils/rubik/index.js';
import User from '@models/user.js';
import Session from '@models/session.js';
import Move from '@models/move.js';
import WelcomeAirdrop from '@models/welcome-airdrop.js';
import {getTokenReward, sendErc20} from '@utils/wallet/index.js';
import pretty from 'pretty-seconds';

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
            { text: "x (↑)"},
            { text: "y (←)"},
            { text: "x (↻)"},
        ],
        input: { placeholder: "Singmaster Notation" }
      });
}

const createRubikMove = async({req, moveNotation,session, rubik, updateSessionState})=>{
    const beforeState = rubik.toString();
    const valid = rubik.move(moveNotation);
    if(valid){
        await Move.create({
            sessionId:session.session_id,
            moveNotation:moveNotation,
            fromState:beforeState,
            toState:rubik.toString(),
            moveTimestamp:req.fc.neynar.postData.action.timestamp
        });
    }

    if(updateSessionState){
        await Session.updateCurrentState(session.session_id,rubik.toString());
    }
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
        const buttonIndex = req.fc.neynar.postData.action.tapped_button.index;
        let {session, rubik} = await getOrCreateRubikSession(req);
        if (buttonIndex === 1) {
            const moves = req.fc.neynar.postData.action.input.text.trim().split(" ").map(v => v.trim());
            for(let i=0;i<moves.length;i++){
                await createRubikMove({
                    req:req,
                    moveNotation:moves[i],
                    session:session,
                    rubik:rubik,
                    updateSessionState:false
                });
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
                        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/claim/${session.session_id}`,
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
        }else if([2,3,4].includes(buttonIndex)){
            switch(buttonIndex){
                case 2:
                    await createRubikMove({
                        req:req,
                        moveNotation:'x',
                        session:session,
                        rubik:rubik,
                        updateSessionState:true
                    });
                    break;
                case 3:
                    await createRubikMove({
                        req:req,
                        moveNotation:'y',
                        session:session,
                        rubik:rubik,
                        updateSessionState:true
                    });
                    break;
                case 4:
                    await createRubikMove({
                        req:req,
                        moveNotation:'z',
                        session:session,
                        rubik:rubik,
                        updateSessionState:true
                    });
                    break;
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
            token:token.ticker,
            amount:token.amount,
            address:to,
            session_id:id
        });

        sendErc20(token.ticker, to, token.amount);

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

export const leaderboard = async(req,res,next)=>{
    try{
        const data = await Session.getLeaderboard(10);
        // console.log(data);//[{ fid: '282770', session_id: 1, duration_seconds: '1008' }]

        let html = `
        Top 10 LeaderBoard:\n
        `

        for(let i=0;i<data.length;i++){
            html+= `${(i+1)}. ${data[i].fid} - ${pretty(parseInt(data[i].duration_seconds))}\n`
        }

        renderFrame(res, {
            image: await req.fc.textToImage(html),
            postUrl: `${process.env.FC_DOMAIN}/frame`,
            buttons: [
                { text: "Go Back" },
            ]
        });
    }catch(err){
        console.error(err);
        next(err);
    }
}

export const myscore = async(req,res,next)=>{
    try{
        const data = await Session.getShortestSolveTime(req.fc.neynar.postData.fid);

        let html = `
        Your Quickest Solve :\n ${data === null ? '' : pretty(parseInt(data.duration_seconds))}
        `

        renderFrame(res, {
            image: await req.fc.textToImage(html),
            postUrl: `${process.env.FC_DOMAIN}/frame`,
            buttons: [
                { text: "Go Back" },
            ]
        });
    }catch(err){
        console.error(err);
        next(err);
    }
}