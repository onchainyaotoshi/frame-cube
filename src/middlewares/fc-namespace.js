import textToImage from "@utils/text-to-image.js";

export const fcNamespace = (req, res, next) => {
    // Add namespace
    req.fc = {
        textToImage: textToImage
    };

    next(); // Move to the next middleware or route handler
}
