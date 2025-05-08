const { json } = require('express/lib/response');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // This should be at the very top of your entry file


const authOrganizer = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
 // console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your actual secret key

    // Attach user_id to the request for downstream access
    req.user_id = decoded.userId;
    req.role = decoded.role
    console.log("aaaa  "+ req.role );

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authOrganizer;

