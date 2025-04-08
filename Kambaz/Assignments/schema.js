import mongoose from "mongoose";
const schema = new mongoose.Schema(
    {
        title: String,
        availableAfterDate: Date,
        dueDate: Date,
        availableUntilDate: Date,
        points: Number,
        description: String,
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    },
    { collection: "assignments" }
);
export default schema;