const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Posts, Likes } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware.js");

//좋아요 수 확인하기
router.get("/posts/:postId/likes", async (req, res) => {
  const { postId } = req.params;
  const likes = await Likes.count({
    where: { postId: postId },
  });

  return res.status(200).json({ data: likes });
});

// 좋아요
router.post("/posts/:postId/likes", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const myLike = await Likes.findOne({
      where: { UserId: userId, PostId: postId },
    });
    if (myLike) {
      await Likes.destroy({
        where: {
          UserId: userId,
          PostId: postId,
        },
      });
      res.status(200).json({
        liked: false,
      });
    } else {
      await Likes.create({
        UserId: userId,
        PostId: postId,
      });
      res.status(200).json({
        liked: true,
      });
    }
  } catch (error) {
    return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
});
module.exports = router;
