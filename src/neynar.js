
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

// Middleware to include the utility function in every request
export default function includeUtilityFunction(req, res, next) {
    // Attach the utility function to the request object
    req.client = client;

    next(); // Move to the next middleware or route handler
}

