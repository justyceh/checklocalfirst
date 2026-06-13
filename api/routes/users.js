import express from 'express'
import { supabase } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {

    const {data: userData, error: userError} = await supabase.from('users').select('account_type').eq('user_id', req.user.id).single();

    if(userError){
        return res.status(500).json({error: userError.message});
    }

    if(userData.account_type !== 'admin'){
        return res.status(403).json({message: 'Unauthorized admins only'});
    }

    const {data, error} = await supabase.from('users').select('*');

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got users successfully", data: data});
})


router.get('/me', authMiddleware, async (req, res) => {
    const {data, error} = await supabase.from('users').select('*').eq('user_id', req.user.id).single();

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Got users info', data: data});

})

router.put('/me', authMiddleware, async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;

    const {data, error} = await supabase.from('users').update({first_name, last_name, email, phone}).eq('user_id', req.user.id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Updated user info', data: data});

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