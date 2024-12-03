import * as assignmentDao from "./dao.js";
export default function AssignmentRoutes(app) {
    app.delete("/api/assignments/:assignmentId", async (req, res) => {
        const { assignmentId } = req.params;
        await assignmentDao.deleteAssignment(assignmentId);
        res.sendStatus(204);
    });
    app.put("/api/assignments/:assignmentId", async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        await assignmentDao.updateAssignment(assignmentId, assignmentUpdates);
        res.sendStatus(204);
    });

}