import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const { data, error} = await supabase.from('businesses').select('*');

    if(error){return res.status(500).json({error: error.message})}

    res.json(data);
})

router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();

    if(error){return res.status(500).json({ error: error.message })}

    res.json(data);
})

export default router