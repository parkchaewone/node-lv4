const { Posts } = require("../models");

class PostRepository {
  async newPost(UserId, title, content) {   
    const post = await Posts.create({
      UserId,
      title,
      content,
    });
    return post;
  }
}
module.exports = PostRepository;
