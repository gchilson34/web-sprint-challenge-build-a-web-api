// add middlewares here related to actions
const Actions = require('./actions-model');

function validateAction(req, res, next) {
    const action = req.body;
    if (!action.project_id || !action.description || !action.notes) {
        res.status(400).json({ message: "missing a required field" });
    } else {
        next();
    }
}

module.exports = { validateAction };