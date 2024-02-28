
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

export const neynar = (req, res, next) => {
    // Attach the utility function to the request object
    req.fc.neynar = {client};

    next(); // Move to the next middleware or route handler
}

export const validateFrameAction = async (req, res, next) => {
    const { trustedData, untrustedData } = req.body;
    let result;
    try {
        //since farcaster required post response in 5 seconds, sometimes not validate is a wise move.
        if(process.env.FC_VALIDATE_FRAME_ACTION == "1" || req.path.includes("/claim")){
            // Wait for the async validation function to complete
            result = await req.fc.neynar.client.validateFrameAction(trustedData.messageBytes);
            if (result.valid) {
                const fid = result.action.interactor.fid;
                const action = result.action;

                req.fc.neynar.postData = {fid,action};
                
                next(); // Proceed to the next middleware/route handler
            } else {
                next(new Error('Invalid data provided'))
            }
        }else{
            const fid = untrustedData.fid;
            const action = {
                timestamp: (new Date(untrustedData.timestamp)).toISOString(),
                tapped_button: { index: untrustedData.buttonIndex},
                input: {text: untrustedData.inputText}
            }

            req.fc.neynar.postData = {fid,action};

            next();
        }
    } catch (error) {
        next(error);
    }
};