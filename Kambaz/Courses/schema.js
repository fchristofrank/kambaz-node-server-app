import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
    credits: Number,
    description: String,
    imgSource: String,
    likes: Number
  },
  { collection: "courses" }
);
export default courseSchema;