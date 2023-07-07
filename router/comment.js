const express = require("express");
const router = express.Router();
const { Posts, Comments } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware.js");

// 댓글 생성
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId);

    try {
      const { content } = req.body;
      const { userId } = res.locals.user;
      await Comments.create({
        UserId: userId,
        PostId: postId,
        content,
      });
      return res.status(200).json({ message: "댓글을 생성하였습니다." });
    } catch {
      return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
    }
  } catch {
    return res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 댓글 조회
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comments.findAll({
      where: { postId },
      order: [["createdAt", "desc"]],
    });
    const post = await Comments.findOne({
      where: { postId },
    });
    //게시물 존재여부를 확인합니다
    if (!post) {
      return res.status(404).json({
        errormassege: "게시물이 존재하지 않슨니다.",
      });
    }
    //댓글 존재여부를 확인합니다.
    if (!comments) {
      return res.status(404).json({ error: "댓글이 존재하지 않습니다." });
    }

    res.status(200).json({ data: comments });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "댓글조회에 실패했습니다." });
  }
});

/// 댓글 수정
router.put("/:postId/comments/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { password, content } = req.body;
    const Post = await Posts.findOne({
      where: { postId: postId },
    });
    if (!Post) {
      return res.status(404).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
    const comment = await Comments.findOne({
      where: { commentId: commentId, postId: postId },
    });
    if (!comment) {
      return res.status(404).json({ errorMessage: "댓글 조회에 실패하였습니다." });
    }
    if (password === comment.password) {
      await Comment.update({ content }, { where: { commentId: commentId } });
      return res.status(200).json({ message: "댓글을 수정하였습니다." });
    } else {
      return res.status(404).json({ errorMessage: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
});

// 댓글 삭제
router.delete("/:postId/comments/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { password } = req.body;
    // const { userId } = res.locals.user;
    // const post = await Posts.findOne({
    //   where: { postId: postId, commentId: commentId },
    // });
    // if (!post) {
    //   return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    // }
    const comment = await Comments.findOne({
      where: { commentId: commentId, postId: postId },
    });
    console.log(comment);

    if (!comment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }
    if (password === comment.password) {
      return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } else {
      return res.status(404).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ errmessage: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
