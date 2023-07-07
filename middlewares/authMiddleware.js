const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  const { accessToken } = req.cookies;

  try {
    const decodedAccessToken = jwt.verify(accessToken, "secret-key");
    const user = await Users.findOne({
      where: {
        userId: decodedAccessToken.userId,
      },
    });
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
