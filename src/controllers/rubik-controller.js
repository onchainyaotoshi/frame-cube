import { renderFrame } from '@utils/render-frame.js';
import Rubik from '@utils/rubik/index.js';
import User from '@models/user.js';
import Session from '@models/session.js';
import Move from '@models/move.js';
import WelcomeAirdrop from '@models/welcome-airdrop.js';
import {getTokenReward, sendErc20} from '@utils/wallet/index.js';
import pretty from 'pretty-seconds';
import {renderFrameHome} from '@controllers/frame-controller.js';

const getOrCreateRubikSession = async(req)=>{
    await User.createIfNotExists(req.fc.neynar.postData.fid);
    let session = await Session.findActiveByFid(req.fc.neynar.postData.fid);
    let fastestSolveTime = await Session.getShortestSolveTime(req.fc.neynar.postData.fid);
                
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

    return {session,rubik, fastestSolveTime}
}

const renderFrameUnsolvedRubik = async (res, rubik)=>{
    renderFrame(res, {
        image: rubik.renderToBase64(),
        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/run`,
        buttons: [
            { text: "Run" },
            { text: "Guide"},
            { text: "Home"},
            // { text: "x (↻)"},
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
        let {session, rubik, fastestSolveTime} = await getOrCreateRubikSession(req);
        if (buttonIndex === 1) {
            const commands = req.fc.neynar.postData.action.input.text.trim();
            if(commands.toLowerCase() == 'home'){
                return renderFrameHome(res);
            }else if(commands.toLowerCase() == 'reset'){
                await Session.deleteSessionById(session.session_id);
                return renderFrameHome(res);
            }

            const moves = commands.split(" ").map(v => v.trim());
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
                let claimed = true;
                await Session.markSessionAsCompleted(session.session_id,req.fc.neynar.postData.action.timestamp);
                const duration = await Session.getSolveTime(session.session_id);
                if(fastestSolveTime == null){
                    claimed = false;
                }else if(parseInt(duration) < parseInt(fastestSolveTime)){
                    claimed = false;
                }

                // const claimed = await WelcomeAirdrop.findByFid(req.fc.neynar.postData.fid);
                if(!claimed){
                    renderFrame(res, {
                        image: await req.fc.textToImage(`
                        Congratulations on solving the Rubik's Cube \n\nin\n\n ${pretty(parseInt(duration))}!
                        `),
                        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/claim/${session.session_id}`,
                        buttons: [
                            { text: "Claim Reward" },
                        ]
                    });
                }else{
                    renderFrame(res, {
                        image: await req.fc.textToImage(`
                        Congratulations on solving the Rubik's Cube \n\n ${pretty(parseInt(duration))}!\n
                        You can claim the rewards, if:\n\n current solve time < fastest solve time record.\n
                        Your fastest solve time is ${pretty(parseInt(fastestSolveTime))}
                        `), 
                        postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
                        buttons: [
                            { text: "Play again?" },
                            { text: "Home", target:`${process.env.FC_DOMAIN}/frame` },
                        ]
                    });
                }
            }
        }else if([2].includes(buttonIndex)){
            return renderFrame(res, {
                image: await req.fc.textToImage(`
                - u: up or top , r: right, l: left, f: front\n
                - b: back, d: down or bottom\n
                - q: Counterclockwise turn (e.g., uq for Up layer).\n
                - w: 180-degree turn (e.g., uw for 2x Up layer).\n
                - m: Middle (l-r), e: Equatorial (u-d), s: Standing (f-b)\n
                - x (or y or z): Rotate cube 90° around X, Y, Z\n
                - reset: scramble, home: return homepage\n
                - ex: u rq fw -> Up ↻, Right ↺, Front 2x
                `),
                postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
                buttons: [
                    { text: "Continue"},
                ]
            });

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
                default:
                    next(new Error('invalid button index'));
                    break;
            }

            renderFrameUnsolvedRubik(res, rubik);
        }else if(buttonIndex == 3){
            return renderFrameHome(res);
        }else{
            next(new Error('invalid button index'));
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
        let token;
        try{
            token = await getTokenReward();
            to = req.fc.neynar.postData.action.interactor.verified_addresses.eth_addresses[0];

            if(!to){
                throw new Error('no verified address found');
            }
        }catch(err){
            await WelcomeAirdrop.create({
                fid:req.fc.neynar.postData.fid,
                token:token.ticker,
                amount:token.amount,
                address:null,
                session_id:id
            });

            //user dont set his eth address on his farcaster account yet
            return renderFrame(res, {
                image: await req.fc.textToImage(`
                Please verify your Farcaster wallet\n\n in the menu settings under 'Verified Addresses'.\n\n
                After you verified it, \n\nyou can give this session id: \'${id}\' to the dev.
                `),
                postUrl: `${process.env.FC_DOMAIN}/frame/rubik/start`,
                buttons: [
                    { text: "Play again?" },
                    { text: "Home", target:`${process.env.FC_DOMAIN}/frame` },
                ]
            });
        }

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
                { text: "Home", target:`${process.env.FC_DOMAIN}/frame` },
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
        const data = await Session.getLeaderboard(8);
        const total = await Session.getTotalPlayerByStatus('completed');
        const totalUsers = await User.count();
        // console.log(data);//[{ fid: '282770', session_id: 1, duration_seconds: '1008' }]

        let html = `
        Total Unique Players: ${totalUsers}\n
        Top 8 Fastest Solves Leaderboard From ${total}:\n
        `

        for(let i=0;i<data.length;i++){
            html+= `${(i+1)}. ${data[i].fid} - ${pretty(parseInt(data[i].duration_seconds))}\n\n`
        }

        renderFrame(res, {
            image: await req.fc.textToImage(html, 24),
            postUrl: `${process.env.FC_DOMAIN}/frame`,
            buttons: [
                { text: "Home" },
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
        Your Fastest Solve :\n 
        ${data === null ? '' : pretty(parseInt(data))}
        `

        renderFrame(res, {
            image: await req.fc.textToImage(html),
            postUrl: `${process.env.FC_DOMAIN}/frame`,
            buttons: [
                { text: "Home" },
            ]
        });
    }catch(err){
        console.error(err);
        next(err);
    }
}