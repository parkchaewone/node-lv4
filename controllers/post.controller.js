const PostService = require("../services/post.service");

class PostController {
  constructor() {
    this.postService = new PostService();
  }
  async post(req, res, next) {
    try {
      const { userId } = res.locals.user;
      const { title, content } = req.body;
      const newPost = await this.postService.post(userId, title, content);
      console.log({ newPost });
      return res.status(201).json({ data: newPost });
    } catch (error) {
      res.status(500).json({ errorMessage: "게시글이 작성되지 않았습니다." });
      console.log("error:", error.message);
    }
  }
}
module.exports = PostController;
