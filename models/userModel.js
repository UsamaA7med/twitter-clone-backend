import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    profileImage: {
      type: Object,
      default: {
        url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        publicId: null,
      },
    },
    coverImage: {
      type: Object,
      default: {
        url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        publicId: null,
      },
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const validateCreateUser = (body) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
};

const validateUpdateUser = (body) => {
  const schema = Joi.object({
    userName: Joi.string(),
    fullName: Joi.string(),
    email: Joi.string().email(),
    currentPassword: Joi.string().min(6),
    newPassword: Joi.string().min(6),
    profileImage: Joi.string(),
    coverImage: Joi.string(),
    bio: Joi.string(),
    link: Joi.string(),
  });
  return schema.validate(body);
};

const User = mongoose.model("User", userSchema);

export { User, validateCreateUser, validateUpdateUser };
