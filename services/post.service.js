const { Op } = require("sequelize");
const PostRepository = require("../repositories/post.repository");

class PostService {
  constructor() {
    this.postRepository = new PostRepository();
  }
  async post(userId, title, content) {
    const newPost = await this.postRepository.newPost(userId, title, content);
    return newPost;
  }
}
module.exports = PostService;
