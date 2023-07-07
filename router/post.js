const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const authMiddleware = require("../middlewares/authMiddleware.js");
const { Posts } = require("../models");

// 게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  const post = await Posts.create({
    UserId: userId,
    title,
    content,
  });

  return res.status(201).json({ data: post });
});
// 게시글 목록 조회

router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["UserId", "postId", "title", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    where: { postId },
  });

  return res.status(200).json({ data: post });
});

// 게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user;
  const post = await Posts.findOne({
    where: { postId: postId },
  });
  if (!post) {
    return res.status(400).json({ errorMessage: "존재하지 않는 게시글입니다." });
  }
  if (userId !== post.UserId) {
    return res.status(400).json({ errorMessage: "게시글 수정이 불가능합니다." });
  } else {
    await Posts.update({ title, content }, { where: { postId: postId } });
    res.status(201).json({ message: "게시글이 수정되었습니다." });
  }
});

//게시글 삭제
router.delete("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const post = await Posts.findOne({
    where: { postId: postId },
  });
  if (!post) return res.status(400).json({ errMessage: "존재하지 않는 게시글입니다." });
  if (post) {
    if (userId !== post.UserId) {
      return res.status(400).json({ errMessage: "게시글을 삭제할 수 없습니다." });
    } else {
      await Posts.destroy({ where: { postId: postId } });
      res.status(201).json({ message: "게시글이 삭제되었습니다." });
    }
  }
});
module.exports = router;
