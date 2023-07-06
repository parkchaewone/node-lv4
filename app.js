const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./router/users.js');
const authRouter = require('./router/auth.js');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, authRouter]);

app.listen(PORT, () => {
  console.log(`${PORT}로 서버가 열렸어요`);
});
