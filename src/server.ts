import express from 'express';
import router from './router';
import morgan from 'morgan';
import { protect } from './modules/auth';
import { createNewUser, signInUser } from './handlers/user';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200);
  res.json({ message: 'Modi server online' });
});

// middleware for protecting routes. Need JWT to access routes
app.use('/api', protect, router);

// create new user
app.post('/user', createNewUser);

// sign in user
// app.post('/signin', signInUser);

app.use((err, req, res, next) => {
  if (err.type === 'auth') {
    res.status(401);
    res.json({ message: 'unauthorized' });
  } else if (err.type === 'input') {
    res.status(400);
    res.json({ message: 'bad input' });
  } else {
    res.status(500);
    res.json({ message: 'Oops...something went wrong' });
  }
});

export default app;
