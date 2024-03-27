import prisma from '../db';
import { createJWT, comparePasswords, hashPassword } from '../modules/auth';

//database queries are async
export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};

export const signInUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  // compares the password from the request to the hashed password in the database
  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: 'not authorized' });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
