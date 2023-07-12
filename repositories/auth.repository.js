const { Users } = require("../models");

class AuthRepository {
  async createUser(email, userpassword) {
    // 닉네임, 패스워드를 DB에 저장합니다.
    const newUser = await Users.create({
      password: userpassword,
      email,
    });
    return newUser;
  }
}
module.exports = AuthRepository;
