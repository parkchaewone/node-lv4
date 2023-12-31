const { Op } = require("sequelize");
const PostRepository = require("../repositories/post.repository");

class PostService {
  constructor() {
    this.postRepository = new PostRepository();
  }
  //생성
  async post(userId, title, content) {
    const newPost = await this.postRepository.newPost(userId, title, content);
    return newPost;
  }
  //조회
  async postList() {
    const posts = await this.postRepository.postList();
    if (!posts.length) {
      throw new Error("게시물이 존재하지 않습니다.");
    }
    return posts;
  }
  //상세조회
  async onePost(postId) {
    const onePost = await this.postRepository.onePost(postId);
    console.log(onePost);
    return onePost;
  }
  //수정
  async revise(postId, userId, title, content) {
    if (!postId) {
      return res.status(400).json({ errorMessage: "존재하지 않는 게시글입니다." });
    }
    const expost = await this.postRepository.onePost(postId);

    if (userId !== expost.dataValues.UserId) {
      return "실패";

      // res.status(400).json({ errorMessage: "게시글 수정이 불가능합니다." });
    } else {
      await this.postRepository.revise(postId, userId, title, content);
      return { message: "게시글이 수정되었습니다." };
    }
  }
  //삭제
  async deletePost(postId, userId) {
    const post = await this.postRepository.onePost(postId);
    if (!post) return res.status(400).json({ errorMessage: "존재하지 않는 게시글입니다." });
    // const post = await this.postRepository.pos(postId);
    if (post) {
      if (userId !== post.dataValues.UserId) {
        return res.status(400).json({ errorMessage: "게시글을 삭제할 수 없습니다." });
      } else {
        await Posts.destroy({ where: { postId: postId } });
        res.status(201).json({ message: "게시글이 삭제되었습니다." });
      }
    }
    return deletePost;
  }
}
module.exports = PostService;
