import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema);

export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }

        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }

        const users = await dao.findAllUsers();
        res.json(users);
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };
    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
    };

    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);

    };
    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }

    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const newCourse = await courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    app.post("/api/users/current/courses", createCourse);


    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.get("/api/users/:userId", findUserById);
    app.delete("/api/users/:userId", deleteUser);

    const findCoursesForUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        if (currentUser.role === "ADMIN") {
          const courses = await courseDao.findAllCourses();
          res.json(courses);
          return;
        }
        let { uid } = req.params;
        if (uid === "current") {
          uid = currentUser._id;
        }
        const courses = await enrollmentsDao.findCoursesForUser(uid);
        res.json(courses);
      };
      app.get("/api/users/:uid/courses", findCoursesForUser);

      const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
          const currentUser = req.session["currentUser"];
          uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
      };
      const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
          const currentUser = req.session["currentUser"];
          uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
      };
      app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
      app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

      const addConnection = async (req, res) => {
        const { userID, connectionID } = req.body;

        // 1. Validate inputs
        if (!userID || !connectionID) {
          return res
            .status(400)
            .json({ error: "Both userID and connectionID are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(userID)) {
          return res.status(400).json({ error: "userID is not a valid ObjectId" });
        }

        try {
          // 2. Atomically add connectionID if not already present
          const updatedUser = await model.findByIdAndUpdate(
            userID,
            { $addToSet: { connections: connectionID } },
            { new: true, runValidators: true }
          );

          // 3. Handle not-found
          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }

          // 4. Update session if the updated user is the current session user
          const currentUser = req.session["currentUser"];
          if (currentUser && currentUser._id === userID) {
            req.session["currentUser"] = updatedUser;
          }

          // 5. Return the updated user
          return res.json(updatedUser);
        } catch (error) {
          console.error("Error in addConnection:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      };


      // Register your route (make sure you have `app.use(express.json())` enabled)
      app.post("/api/users/addConnection", addConnection);


}
