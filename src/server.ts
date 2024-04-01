import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createNewUser, signInUser } from './handlers/user';

const app = express();

app.use(morgan('dev'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.status(200);
  res.json({ message: 'Modi server online' });
});

// For development only - allows requests from localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// middleware for protecting routes. Need JWT to access routes
// app.use('/api', protect, router);
app.use('/api', router);

// create new user
// app.post('/user', createNewUser);

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
