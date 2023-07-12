const AuthService = require("../services/auth.service");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }
  async signup(req, res) {
    try {
      const { email, password } = req.body;
      const newUser = await this.authService.signup(email, password);
      res.status(202).json({ Message: "회원가입 완료되었습니다." });
    } catch (error) {
      res.status(500).json({ errorMessage: "회원가입 오류가 발생했습니다." });
    }
  }
}
module.exports = AuthController;
