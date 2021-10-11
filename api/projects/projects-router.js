// Write your "projects" router here!
const express = require('express');
const Projects = require('./projects-model');
const { validateProjectId } = require('./projects-middleware.js');
const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            if(!projects) {
                res.status(404).json([])
            } else {
                res.status(200).json(projects)
            }
        })
        .catch(error => {
            res.status(404).json({ message: 'could not find projects'})
        })
})

router.get('/:id', validateProjectId, (req, res) => {
    const projectId = req.params.id;
    Projects.get(projectId)
        .then(currentProject => {
            res.status(200).json(currentProject);
        })
        .catch(error => {
            res.status(404).json( { message: 'could not find projects'} )
        })
})

router.post('/', (req, res, next) => {
    const newProject = req.body;
    if (!newProject.name || !newProject.description) {
        res.status(400).json( {message: "missing requirements"});
    } else {
        Projects.insert(newProject)
            .then(insertedProject => {
                res.status(201).json(insertedProject);
            })
            .catch(next);
    }
})

router.put('/:id', validateProjectId, (req, res, next) => {
    const updatedProject = req.body;
    const projectId = req.params.id;
    if (!updatedProject.name || !updatedProject.description || updatedProject.completed === undefined) {
        res.status(400).json( {message: "missing requirements"});
    } else { 
        Projects.update(projectId, updatedProject)
            .then(currentProject => { 
                Projects.get(currentProject.id)
                    .then(update => {
                        res.status(200).json(update);
                    })
            })
            .catch(next);
    }
})

router.delete('/:id', validateProjectId, (req, res, next) => {
    const projectId = req.params.id;
    Projects.remove(projectId)
        .then(() => {
            res.status(200).json();
        })
        .catch(next);
})

router.get('/:id/actions', validateProjectId, (req, res, next) => {
    const projectId = req.params.id;
    Projects.getProjectActions(projectId)
        .then(selectedProject => {
            res.status(200).json(selectedProject);
        })
        .catch(next);
})
 
module.exports = router;