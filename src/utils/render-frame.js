/**
 * Renders the 'frame' template with default options that can be overridden.
 *
 * @param {object} res - The Express response object.
 * @param {object} options - The options object containing any overrides.
 */
export const renderFrame = (res, options = {}) => {
    const defaults = {
        title: process.env.FC_APP_NAME
    };

    // Override defaults with any options passed in
    const renderOptions = { ...defaults, ...options };

    // Render the 'frame' template with the combined options
    res.render('frame', renderOptions);
};