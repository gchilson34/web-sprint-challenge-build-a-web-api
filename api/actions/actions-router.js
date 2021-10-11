// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model');
const { validateAction } = require('./actions-middlware');
const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            if (!actions) {
                res.status(200).json([])
            } else {
                res.status(200).json(actions)
            }
        })
        .catch(error => {
            res.status(404).json({ message: 'could not find actions'})
        })
})
 
router.get('/:id', (req, res) => {
    const actionId = req.params.id;
    Actions.get(actionId)
        .then(action => {
            if (action) {
                res.status(200).json(action);
            } else {
                res.status(404).json( {message: "cannot find action with given id"} )
            }
        })
        .catch(error => {
            res.status(404).json({ message: 'could not find actions'})
        })
})

router.post('/', validateAction, (req, res, next) => {
    const newAction = req.body;
    Actions.insert(newAction)
        .then(insertedAction => {
            res.status(201).json(insertedAction)
        })
        .catch(next);
})

router.put('/:id', validateAction, (req, res, next) => {
    const actionId = req.params.id;
    const updatedAction = req.body;
    Actions.update(actionId, updatedAction)
        .then(insertedAction => {
            if (insertedAction) {
                Actions.get(insertedAction.id)
                    .then(update => {
                        res.status(200).json(update)
                    }) 
            } else {
                res.status(404).json( {message: "action could not be found with given id"} )
            }
        })
        .catch(next);
})

router.delete('/:id', (req, res, next) => {
    const actionId = req.params.id;
    Actions.remove(actionId)
        .then(deletedAction => {
            if (deletedAction > 0) {
                res.status(200).json()
            } else {
                res.status(404).json( {message: "action could not be found with given id"} )
            }
        })
        .catch(next);
}) 
 
module.exports = router;