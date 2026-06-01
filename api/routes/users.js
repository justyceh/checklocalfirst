import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', (req, res) => {
    console.log("Got users route");
    res.send("Users Route");
})

export default router