import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    console.log("Got Searching route");
    const searchQuery = req.query.q;

    if(searchQuery === "" || searchQuery === undefined){
        return res.status(400).json({message: "No search term provided"});
    }

    const { data, error} = await supabase.from('services').select('*, businesses(*)').ilike('name' , `%${searchQuery}%`);

    if(error){return res.status(500).json({error: error.message})}

    res.json(data);

})

export default router