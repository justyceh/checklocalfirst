import express from 'express'
import { supabase } from '../dbconnect.js'
import { catchAsync } from '../helpers/catchAsync.js';
import { AppError } from '../helpers/AppError.js';

const router = express.Router()

router.get('/', catchAsync(async (req, res) => {
    const {data, error} = await supabase.from('services').select('*, businesses!inner(name, slug)').eq('businesses.status', 'approved');

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, data });
}))

export default router