import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function createJWT(user) {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
}

// middleware for protecting routes
export function protect(req, res, next) {
  // generic way of sending up a token-puts bearer in front of token
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: 'not authorized' });
    return;
  }

  // first part is bearer, second part is token
  // scott doesn't care about the first part which is why he didn't give it a name
  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401);
    res.json({ message: 'not valid token' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    res.json({ message: 'not valid token' });
    return;
  }
}

export function comparePasswords(password, hash) {
  //returns a promise of true or false that the password matches the hash
  return bcrypt.compare(password, hash);
}

export function hashPassword(password) {
  //returns a promise of the hashed password
  // second param is a salt. Makes the hash harder to guess
  return bcrypt.hash(password, 5);
}
