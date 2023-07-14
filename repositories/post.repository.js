const { Posts, Users } = require("../models");

class PostRepository {
  //생성
  async newPost(UserId, title, content) {
    const post = await Posts.create({
      UserId,
      title,
      content,
    });
    return post;
  }
  //조회
  async postList() {
    const posts = await Posts.findAll({
      include: { model: Users, attributes: ["email"] },
      attributes: ["UserId", "postId", "title", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });
    return posts;
  }
  //상세조회
  async onePost(postId) {
    const onePost = await Posts.findOne({
      attributes: ["postId", "UserId", "title", "content", "createdAt", "updatedAt"],
      where: { postId },
    });
    return onePost;
  }
  //수정
  async revise(postId, userId, title, content) {
    const revise = await Posts.update(
      { title, content },
      {
        where: { postId },
      }
    );
    return revise;
  }
  //삭제
  async deletePost(postId, userId) {
    const deletePost = await Posts.delete(
      { title, content },
      {
        where: { postId },
      }
    );
  }
}
module.exports = PostRepository;
