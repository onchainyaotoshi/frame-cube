
export const homeController = async (req, res, next) => {
    try {
        res.render('coming-soon',{
            link: `https://warpcast.com/yaotoshi`
        });
    } catch (error) {
        next(error);
    }
}