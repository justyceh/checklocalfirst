import express from 'express'
import { supabase, supabaseAdmin } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addFavoriteSchema, removeFavoriteParamSchema } from '../schemas/favoriteSchemas.js';
import { catchAsync } from '../helpers/catchAsync.js';
import { AppError } from '../helpers/AppError.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const {data, error} = await supabaseAdmin.from('favorites').select('*, businesses(*)').eq('user_id', user_id);

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, data });
}))

router.post('/', validate(addFavoriteSchema), catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const { business_id } = req.validated.body;

    const {data, error} = await supabaseAdmin.from('favorites').insert({user_id, business_id});

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(201).json({ success: true, message: "Added to favorites" });
}))

router.delete('/:business_id', validate(removeFavoriteParamSchema), catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const { business_id } = req.validated.params;

    const {data, error} = await supabaseAdmin.from('favorites').delete().eq('business_id', business_id).eq('user_id', user_id);

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, message: "Removed from favorites" });
}))

export default router