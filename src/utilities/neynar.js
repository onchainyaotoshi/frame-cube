
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

export default (req, res, next) => {
    // Attach the utility function to the request object
    req.client = client;
    req.isLive = ()=>process.env.NODE_ENV === 'production';

    next(); // Move to the next middleware or route handler
}

