import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    }
    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecoded.id) {
            req.body.userId = tokenDecoded.id;
        } else {
            return res.json({ success: false, message: 'Invalid token, access denied' });
        }
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token verification failed, access denied' });
    }
}

export default userAuth;