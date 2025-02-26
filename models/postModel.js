import mongoose from "mongoose";
import Joi from "joi";

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postImage: {
      type: Object,
      default: {
        url: "https://via.placeholder.com/300x300",
        publicId: null,
      },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const validateCreatePost = (body) => {
  const schema = Joi.object({
    content: Joi.string().min(1).required(),
  });
  return schema.validate(body);
};

const validateCreateComment = (body) => {
  const schema = Joi.object({
    content: Joi.string().min(1).required(),
  });
  return schema.validate(body);
};

const Post = mongoose.model("Post", postSchema);

export { Post, validateCreatePost, validateCreateComment };
