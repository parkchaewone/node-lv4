const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const bcrypt = require("bcrypt");

// 액세스 토큰 발급
const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, "secret-key", {
    expiresIn: "1h",
  });
};
// 리프레시 토큰 발급
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, "secret-key", {
    expiresIn: "7d",
  });
};
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { refreshToken } = req.cookies;
    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const user = await Users.findOne({
        where: {
          email,
        },
      });
      res.clearCookie("refreshToken");
      const conpassword = bcrypt.compare(password, user.password);
      if (!conpassword) {
        return res.status(400).json({ errorMessage: "패스워드가 일치하지 않습니다." });
      }
      const gat = generateAccessToken(user.userId);

      const grt = generateRefreshToken(user.userId);
      return res.cookie("accessToken", gat).cookie("refreshToken", grt).json({ message: "로그인완료" });
    }
    // Case 2: Access Token과 Refresh Token 모두 만료된 경우
    try {
      jwt.verify(refreshToken, "secret-key");
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;

        const gat = generateAccessToken(userId);

        const grt = generateRefreshToken(userId);

        return res.cookie("accessToken", gat).cookie("refreshToken", grt).json({ message: "ACCESS TOKEN과 REFRESH TOKEN이 갱신되었습니다." });
      }
    }
    // Case 3: Access Token은 만료됐지만 Refresh Token은 유효한 경우
    try {
      jwt.verify(req.cookies.accessToken, "secret-key");
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;

        const gat = generateAccessToken(userId);

        return (
          res
            //{ httpOnly: true} 옵션을사용해서 서버에서만 쿠키에 접근하게 만듦
            .cookie("accessToken", gat, { httpOnly: true })
            .json({ message: "ACCESS TOKEN이 갱신되었습니다." })
        );
      }
    }
    // Case 4: Access Token은 유효하지만 Refresh Token은 만료된 경우
    try {
      jwt.verify(req.cookies.RefreshToken, "secret-key");
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const decodedAccessToken = jwt.decode(accessToken);
        const userId = decodedAccessToken.userId;

        const grt = generateRefreshToken(userId);

        return res.cookie("RefreshToken", grt, { httpOnly: true }).json({ message: "RefreshToken이 갱신되었습니다." });
      }
    }
    // Case 5: Access Token과 Refresh Token 모두 유효한 경우
    if (refreshToken) {
      const decodedRefreshToken = jwt.decode(refreshToken);
      const userId = decodedRefreshToken.userId;
      res.status(200).json({ userId, message: " Access Token과 Refresh Token이 유효합니다." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errormessage: "로그인 오류" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "로그아웃되었습니다." });
});

module.exports = router;
