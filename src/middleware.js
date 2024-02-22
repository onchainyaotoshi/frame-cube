export const validateFramePost = async (req, res, next) => {
    const { trustedData } = req.body;
    try {
        // Wait for the async validation function to complete
        const result = await req.client.validateFrameAction(trustedData.messageBytes);
        if (result.valid) {
            req.payload = result; // Attach validated data to the req object
            req.fid = result.action.interactor.fid;
            req.wallet = result.action.interactor.custody_address;
            req.interactor = result.action.interactor;
            req.action = result.action;
            
            next(); // Proceed to the next middleware/route handler
        } else {
            res.status(400).json({ error: 'Invalid data provided' }); // Data is invalid
        }
    } catch (error) {
        console.error(error);
        // Handle errors from the async validation function
        res.status(500).json({ error: error.message }); // Internal server error or custom error message
    }
};