const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./router/users.js");
const authRouter = require("./router/auth.js");
const postRouter = require("./router/post.js");
const commentRouter = require("./router/comment.js");
const likeRouter = require("./router/like.js");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [likeRouter, usersRouter, authRouter, postRouter, commentRouter]);

// 404에러 캐치 미들웰어
// app.use((req, res, next) => {
//   res.status(404).send("잘못된 api요청 경로입니다.");
// });

app.listen(PORT, () => {
  console.log(`${PORT}로 서버가 열렸어요`);
});
