import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: String,
      email: String,
      lastName: String,
      dob: Date,
      role: {
        type: String,
        enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
        default: "USER",
      },
      loginId: String,
      section: String,
      lastActivity: Date,
      totalActivity: String,
      currentOrg: String,
      experience: String,
      title: String,
      skills: [String] // updated to be a list of strings
    },
  { collection: "users" }
);
export default userSchema;