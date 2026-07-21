import express from 'express'
import { supabase } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { landingSignupSchema } from '../schemas/signupSchemas.js';

const router = express.Router()

router.post('/', validate(landingSignupSchema), async (req, res) => {
    const { name, email, source } = req.validated.body;

    const { data, error } = await supabase
        .from('landing_signups')
        .insert({ name, email, source })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') { // unique_violation on email
            return res.status(409).json({ message: "This email has already signed up" });
        }
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

export default router