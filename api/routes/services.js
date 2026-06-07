import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const {data, error} = await supabase.from('services').select('*, businesses(name, slug)');

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got services successfully", data: data});
})

export default router