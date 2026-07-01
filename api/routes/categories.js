import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const {data, error} = await supabase.from('categories').select('*');

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got categories successfully", data: data});
})

router.post('/', async (req, res) => {
    const { name, slug } = req.body;

    if (!name || !slug) {
        return res.status(400).json({ message: "name and slug are required" });
    }

    const { data, error } = await supabase.from('categories').insert({ name, slug }).select().single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Category created successfully", data: data });
})

export default router