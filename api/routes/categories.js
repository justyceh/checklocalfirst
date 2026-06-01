import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', (req, res) => {
    console.log("Got Categories route");
    res.send("Categories Route");
})

export default router