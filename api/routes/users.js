import express from 'express'
import { supabase } from '../dbconnect.js'
import { authMiddleware, authAdminMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateOwnUserSchema } from '../schemas/userSchemas.js';
import { userIdParamSchema } from '../schemas/adminSchemas.js';
import { catchAsync } from '../helpers/catchAsync.js';
import { AppError } from '../helpers/AppError.js';

const router = express.Router()

router.get('/', authMiddleware, catchAsync(async (req, res) => {

    const {data: userData, error: userError} = await supabase.from('users').select('account_type').eq('user_id', req.user.id).single();

    if(userError){
        throw new AppError(userError.message, 500);
    }

    if(userData.account_type !== 'admin'){
        throw new AppError('Unauthorized admins only', 403);
    }

    const {data, error} = await supabase.from('users').select('*');

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, data });
}))


router.get('/me', authMiddleware, catchAsync(async (req, res) => {
    const {data, error} = await supabase.from('users').select('*').eq('user_id', req.user.id).single();

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, data });
}))

router.put('/me', authMiddleware, validate(updateOwnUserSchema), catchAsync(async (req, res) => {
    const { first_name, last_name, email, phone } = req.validated.body;

    const {data, error} = await supabase.from('users').update({first_name, last_name, email, phone}).eq('user_id', req.user.id);

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, data });
}))

router.get('/:id', authMiddleware, authAdminMiddleware, validate(userIdParamSchema), catchAsync(async (req, res) => {
    const { id } = req.validated.params;
    const {data, error} = await supabase.from('users').select('*').eq('user_id', id).single();

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, data });
}))


export default router