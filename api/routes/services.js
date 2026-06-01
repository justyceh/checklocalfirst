import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', (req, res) => {
    console.log("Got services route");
    res.send("Services Route");
})

export default router