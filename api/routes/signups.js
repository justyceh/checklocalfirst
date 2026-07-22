import express from 'express'
import { supabase, supabaseAdmin } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { landingSignupSchema } from '../schemas/signupSchemas.js';
import { catchAsync } from '../helpers/catchAsync.js';
import { AppError } from '../helpers/AppError.js';

const router = express.Router()

router.post('/', validate(landingSignupSchema), catchAsync(async (req, res) => {
    const { name, email, source } = req.validated.body;

    const { data, error } = await supabaseAdmin
        .from('landing_signups')
        .insert({ name, email, source })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            throw new AppError('This email has already signed up', 409);
        }
        throw new AppError(error.message, 500);
    }

    res.status(201).json({ success: true, data });
}))

export default router