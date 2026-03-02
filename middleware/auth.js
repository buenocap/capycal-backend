import jwt from "jsonwebtoken";

//Middleware that extracts the token from the request header
export default function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1]; //Bearer
  if (token == null) return res.sendStatus(401); //Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //Invalid token
    req.user = user;
    next();
  });
}
