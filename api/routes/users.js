import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const {data, error} = await supabase.from('users').select('*');

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got users successfully", data: data});
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const {data, error} = await supabase.from('users').select('*').eq('user_id', id).single();

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got user successfully", data: data});
})

export default router