const PostService = require("../services/post.service");

class PostController {
  constructor() {
    this.postService = new PostService();
  }
  // 포스트 게시물 작성
  async post(req, res, next) {
    try {
      const { userId } = res.locals.user;
      const { title, content } = req.body;
      const newPost = await this.postService.post(userId, title, content);
      return res.status(201).json({ data: newPost });
    } catch (error) {
      res.status(500).json({ errorMessage: "게시글이 작성되지 않았습니다." });
      console.log("error:", error.message);
    }
  }
  // 게시물 전체 조회 api
  async postList(req, res, next) {
    try {
      const postsList = await this.postService.postList();

      return res.status(200).json({ data: postsList });
    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    }
  }
  //게시물 상세조회
  async onePost(req, res, next) {
    const { postId } = req.params;
    const onePost = await this.postService.onePost(postId);
    res.status(200).json({ data: onePost });
  }
  //게시글 수정
  async revise(req, res, next) {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals.user;
    const revise = await this.postService.revise(postId, userId, title, content);
    res.status(200).json({ data: revise.message });
  }
  // //게시글 삭제
  // async deletePost(req, res, next) {
  //   const { postId } = req.params;
  //   const { userId } = res.locals.user;
  //   const deletePost = await this.postService.deletePost(postId, userId);
  // }
}

module.exports = PostController;
