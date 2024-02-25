
export const homeController = async (req, res, next) => {
    try {
        res.render('coming-soon');
    } catch (error) {
        next(error);
    }
}