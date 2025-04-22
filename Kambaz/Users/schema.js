import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    dob: Date,
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
      default: "USER",
    },
    loginId: { type: String, unique: true },
    section: String,
    lastActivity: Date,
    totalActivity: String,
    currentOrganization: String, // <-- matches DB field name
    title: String,
    skills: [String], // ✅ Correct
    description: String,
    experience: [[String]], // ✅ Matches array of arrays of strings
    connections: [String], // ✅ If you're not using Mongoose ObjectId references
  },
  { collection: "users", strict: false } // enforce defined fields only
);


export default userSchema;
