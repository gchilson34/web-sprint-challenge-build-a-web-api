// add middlewares here related to projects
const Projects = require('./projects-model');

function validateProjectId(req, res, next) {
    const projectId = req.params.id;
    Projects.get(projectId)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(404).json({ message: "cannot find project with the given id" });
            }
        })
        .catch(next)
}

module.exports = { validateProjectId };