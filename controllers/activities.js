import express from 'express'
import Activity from '../models/activity.js'
import errorHandler from '../middleware/errorHandler.js'
import isSignedIn from '../middleware/isSignedIn.js'
import { Forbidden, NotFound } from '../utils/errors.js'

const router = express.Router()

// * Routes

// Index
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find()
    return res.json(activities)
  } catch (error) {
    errorHandler(error, res)
  }
})

// Create
router.post('/activities', isSignedIn, async (req, res) => {
  try {
    req.body.owner = req.user._id
    const activity = await Activity.create(req.body)
    return res.status(201).json(activity)
  } catch (error) {
    errorHandler(error, res)
  }
})

// Show
router.get('/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params
    const activity = await Activity.findById(activityId)
    if (!activity) throw new NotFound('Activity not found')
    return res.json(activity)
  } catch (error) {
    errorHandler(error, res)
  }
})

// Update
router.put('/activities/:activityId', isSignedIn, async (req, res) => {
  try {
    const { activityId } = req.params
    const activity = await Activity.findById(activityId)

    // 404 if activity not found
    if (!activity) throw new NotFound('Activity not found')

    // 403 if user not owner of activity 
    if (!activity.owner.equals(req.user._id)) throw new Forbidden()

    // Perform the update
    const updatedActivity = await Activity.findByIdAndUpdate(activityId, req.body, { new: true })
    
    // Return updated object
    return res.json(updatedActivity)
  } catch (error) {
    errorHandler(error, res)
  }
})


// Delete
router.delete('/activities/:activityId', isSignedIn, async (req, res) => {
  try {
    const { activityId } = req.params
    const activity = await Activity.findById(activityId)

    // 404 if activity not found
    if (!activity) throw new NotFound('Activity not found')

    // 403 if user not owner of activity 
    if (!activity.owner.equals(req.user._id)) throw new Forbidden()

    await Activity.findByIdAndDelete(activityId)

    return res.sendStatus(204)
  } catch (error) {
    errorHandler(error, res)
  }
})


export default router