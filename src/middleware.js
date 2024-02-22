export const validateFramePost = async (req, res, next) => {
    const { trustedData, untrustedData } = req.body;
    let result;

    try {
        //since farcaster required post response in 5 seconds, sometimes not validate is a wise move.
        if(process.env.NEYNAR_SECURED == "1"){
            // Wait for the async validation function to complete
            result = await req.client.validateFrameAction(trustedData.messageBytes);
            if (result.valid) {
                req.fid = result.action.interactor.fid;
                req.action = result.action;
                
                next(); // Proceed to the next middleware/route handler
            } else {
                res.status(400).json({ error: 'Invalid data provided' }); // Data is invalid
            }
        }else{
            req.fid = untrustedData.fid;
            req.action = {
                timestamp: (new Date(untrustedData.timestamp)).toISOString(),
                tapped_button: { index: untrustedData.buttonIndex},
                input: {text: untrustedData.inputText}
            }

            next();
        }
    } catch (error) {
        console.error(error);
        // Handle errors from the async validation function
        res.status(500).json({ error: error.message }); // Internal server error or custom error message
    }
};