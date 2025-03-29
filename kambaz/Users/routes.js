import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => {
        const { userId } = req.params;
        dao.deleteUser(userId);
        res.sendStatus(204);
    };
    const findAllUsers = (req, res) => {
        const users = dao.findAllUsers();
        res.json(users);
    };
    const findUserById = (req, res) => { };
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);

    };
    const signin = (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
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
        if (!req.sessionStore?.sessions) {
            console.error("Session store is empty or not initialized.");
            res.sendStatus(500);
            return;
        }

        const sessionKeys = Object.keys(req.sessionStore.sessions);
        if (sessionKeys.length === 0) {
            console.error("No active sessions found.");
            res.sendStatus(401);
            return;
        }

        const sessionData = req.sessionStore.sessions[sessionKeys[0]];

        if (!sessionData) {
            console.error("Session data is empty.");
            res.sendStatus(401);
            return;
        }

        let parsedSession;
        try {
            parsedSession = JSON.parse(sessionData);
        } catch (error) {
            console.error("Error parsing session JSON:", error);
            res.sendStatus(500);
            return;
        }

        if (!parsedSession.currentUser) {
            console.error("currentUser not found in session.");
            res.sendStatus(401);
            return;
        }

        const currentUser = parsedSession.currentUser;
        res.json(currentUser);
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const createCourse = (req, res) => {
        if (!req.sessionStore?.sessions) {
            console.error("Session store is empty or not initialized.");
            res.sendStatus(500);
            return;
        }

        const sessionKeys = Object.keys(req.sessionStore.sessions);
        if (sessionKeys.length === 0) {
            console.error("No active sessions found.");
            res.sendStatus(401);
            return;
        }

        const sessionData = req.sessionStore.sessions[sessionKeys[0]];

        if (!sessionData) {
            console.error("Session data is empty.");
            res.sendStatus(401);
            return;
        }

        let parsedSession;
        try {
            parsedSession = JSON.parse(sessionData);
        } catch (error) {
            console.error("Error parsing session JSON:", error);
            res.sendStatus(500);
            return;
        }

        if (!parsedSession.currentUser) {
            console.error("currentUser not found in session.");
            res.sendStatus(401);
            return;
        }

        const currentUser = parsedSession.currentUser;

        // Create a new course
        const newCourse = courseDao.createCourse(req.body);

        // Enroll the current user in the newly created course
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

    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

    const findEnrollmentsForUser = (req, res) => {

        if (!req.sessionStore?.sessions) {
            console.error("Session store is empty or not initialized.");
            res.sendStatus(500);
            return;
        }

        const sessionKeys = Object.keys(req.sessionStore.sessions);
        if (sessionKeys.length === 0) {
            console.error("No active sessions found.");
            res.sendStatus(401);
            return;
        }

        // Extract the first session data dynamically
        const sessionData = req.sessionStore.sessions[sessionKeys[0]];

        if (!sessionData) {
            console.error("Session data is empty.");
            res.sendStatus(401);
            return;
        }

        let parsedSession;
        try {
            parsedSession = JSON.parse(sessionData);
        } catch (error) {
            console.error("Error parsing session JSON:", error);
            res.sendStatus(500);
            return;
        }

        if (!parsedSession.currentUser) {
            console.error("currentUser not found in session.");
            res.sendStatus(401);
            return;
        }

        const currentUser = parsedSession.currentUser;
        console.log("Current User:", currentUser);

        let { userId } = req.params;
        if (userId === "current") {
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }

        // Call your DAO method to fetch enrollments
        const enrollments = enrollmentsDao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    };


    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);

    const deleteEnrollment = (req, res) => {
        let { userId, courseId } = req.params;

        if (userId === "current") {
            if (!req.sessionStore?.sessions) {
                console.error("Session store is empty or not initialized.");
                res.sendStatus(500);
                return;
            }

            const sessionKeys = Object.keys(req.sessionStore.sessions);
            if (sessionKeys.length === 0) {
                console.error("No active sessions found.");
                res.sendStatus(401);
                return;
            }

            const sessionData = req.sessionStore.sessions[sessionKeys[0]];

            if (!sessionData) {
                console.error("Session data is empty.");
                res.sendStatus(401);
                return;
            }

            let parsedSession;
            try {
                parsedSession = JSON.parse(sessionData);
            } catch (error) {
                console.error("Error parsing session JSON:", error);
                res.sendStatus(500);
                return;
            }

            if (!parsedSession.currentUser) {
                console.error("currentUser not found in session.");
                res.sendStatus(401);
                return;
            }

            const currentUser = parsedSession.currentUser;
            userId = currentUser._id;
        }

        // Perform the unenrollment operation
        enrollmentsDao.unEnrollUserFromCourse(userId, courseId);
        res.sendStatus(200);
    };

    app.delete("/api/users/:userId/:courseId/enrollments", deleteEnrollment);

    const addEnrollment = (req, res) => {
        let { userId, courseId } = req.params;

        if (userId === "current") {
            if (!req.sessionStore?.sessions) {
                console.error("Session store is empty or not initialized.");
                res.sendStatus(500);
                return;
            }

            const sessionKeys = Object.keys(req.sessionStore.sessions);
            if (sessionKeys.length === 0) {
                console.error("No active sessions found.");
                res.sendStatus(401);
                return;
            }

            const sessionData = req.sessionStore.sessions[sessionKeys[0]];

            if (!sessionData) {
                console.error("Session data is empty.");
                res.sendStatus(401);
                return;
            }

            let parsedSession;
            try {
                parsedSession = JSON.parse(sessionData);
            } catch (error) {
                console.error("Error parsing session JSON:", error);
                res.sendStatus(500);
                return;
            }

            if (!parsedSession.currentUser) {
                console.error("currentUser not found in session.");
                res.sendStatus(401);
                return;
            }

            const currentUser = parsedSession.currentUser;
            userId = currentUser._id;
        }

        // Perform the enrollment operation
        const enrollments = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollments);
    };

    app.post("/api/users/:userId/:courseId/enrollments", addEnrollment);
}
