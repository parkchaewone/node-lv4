const bcrypt = require("bcrypt");
const saltRounds = 10;
const AuthRepository = require("../repositories/auth.repository");

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }
  async signup(email, password) {
    if (!email || !password) {
      throw new Error("이메일 혹은 패스워드를 입력해주세요.");
    }
    const userpassword = bcrypt.hashSync(password, saltRounds);
    const newUser = await this.authRepository.createUser(email, userpassword);
    return newUser;
  }
}
module.exports = AuthService;
