import * as assignmentDao from "./dao.js";
export default function AssignmentRoutes(app) {
    app.delete("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        assignmentDao.deleteAssignment(assignmentId);
        res.sendStatus(204);
    });
    app.put("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        assignmentDao.updateAssignment(assignmentId, assignmentUpdates);
        res.sendStatus(204);
    });

}