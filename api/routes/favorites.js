import express from 'express'
import { supabase } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    const user_id = req.user.id;

    const {data, error} = await supabase.from('favorites').select('*, businesses(*)').eq('user_id', user_id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({data: data});

})

router.post('/', async (req, res) => {
    const user_id = req.user.id;
    const business_id = req.body.business_id;

    const {data, error} = await supabase.from('favorites').insert({user_id, business_id});

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(201).json({message: "Added to favorites"});

})

router.delete('/:business_id', async (req, res) => {
    const user_id = req.user.id;
    const business_id = req.params.business_id;

    const {data, error} = await supabase.from('favorites').delete().eq('business_id', business_id).eq('user_id', user_id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Removed from favorites"});
})

export default router