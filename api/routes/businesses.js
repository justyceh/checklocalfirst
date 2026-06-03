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

router.get('/:slug/services', async (req, res) => {
    const slug = req.params.slug;

    const {data, error} = await supabase.from('businesses').select('id').eq('slug', slug).single();


    if(error){
        return res.status(500).json({error: error.message});
    }

    const businessId = data.id;

    const {data: businessData, error: businessError} = await supabase.from('services').select('*').eq('business_id', businessId);

    if(businessError){
        return res.status(500).json({error: businessError.message});
    }

    return res.status(200).json({data: businessData});
})

export default router