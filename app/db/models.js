import { mongoose } from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    body: {
      type: String,
      required: true,
      maxLength: 500,
    },
    starredBy: {
      type: Array,
    },
    postedBy: {
        type: String,
        required: true,
    }, 
  },
  { timestamps: true }
);


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  avatar: {
    type: String,
    default: "https://api.dicebear.com/6.x/bottts/svg",
  },
});

export const models = [
  {
    name: "Post",
    schema: postSchema,
    collection: "posts",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];