import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
        }

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecoded.id) {
            req.userId = tokenDecoded.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Invalid token, access denied' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ success: false, message: 'Token verification failed, access denied' });
    }
}

export default userAuth;