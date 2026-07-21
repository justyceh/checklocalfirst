import express from 'express'
import { supabase } from '../dbconnect.js'
import { authMiddleware, authAdminMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateOwnUserSchema } from '../schemas/userSchemas.js';
import { userIdParamSchema } from '../schemas/adminSchemas.js';

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

router.put('/me', authMiddleware, validate(updateOwnUserSchema), async (req, res) => {
    const { first_name, last_name, email, phone } = req.validated.body;

    const {data, error} = await supabase.from('users').update({first_name, last_name, email, phone}).eq('user_id', req.user.id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Updated user info', data: data});
})

router.get('/:id', authMiddleware, authAdminMiddleware, validate(userIdParamSchema), async (req, res) => {
    const { id } = req.validated.params;
    const {data, error} = await supabase.from('users').select('*').eq('user_id', id).single();

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got user successfully", data: data});
})


export default router