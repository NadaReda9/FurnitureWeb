
const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
    let token;

 
    if (req.headers.client === 'not-browser') {
        token = req.headers.authorization;
    } else {
        token = req.cookies['Authorization'];
    }

    
    if (!token) {
        return res.status(403).json({ success: false, message: 'غير مصرح: لم يتم تقديم التوكن' });
    }

   
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    } else {
        return res.status(400).json({ success: false, message: 'غير مصرح: التوكن غير صالح (يجب أن يبدأ بـ Bearer)' });
    }

    try {
        
        const jwtVerified = jwt.verify(token, process.env.TOKEN_SECRET);

        // ربط بيانات المستخدم بطلب السيرفر
        req.user = jwtVerified;
        next();

    } catch (error) {
        console.error('JWT Verify Error:', error.message);
    
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token has expired' });
        }
    
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token or incorrect signature' });
        }
    
        return res.status(500).json({ success: false, message: 'Server error while verifying token' });
    }
    
};
