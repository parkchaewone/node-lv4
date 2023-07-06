const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Users } = require('../models');

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ errormassage: '이메일 혹은 패스워드를 입력해주세요.' });
    }
    const userExistence = await Users.findOne({
      where: {
        email,
      },
    });
    const userpassword = bcrypt.hashSync(password, saltRounds);
    // 닉네임, 패스워드를 DB에 저장합니다.
    await Users.create({
      password: userpassword,
      email,
    });
    res.status(202).json({ Message: '회원가입 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ errorMessage: '회원가입 오류가 발생했습니다.' });

    console.log(error);
  }
});

module.exports = router;
