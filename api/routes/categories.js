import express from 'express'
import { supabase } from '../dbconnect.js'
import { authAdminMiddleware, authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema } from '../schemas/categorySchemas.js';

const router = express.Router()

router.get('/', async (req, res) => {
    const {data, error} = await supabase.from('categories').select('*');

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: "Got categories successfully", data: data});
})

router.post('/', authMiddleware, authAdminMiddleware, validate(createCategorySchema), async (req, res) => {
    const { name, slug } = req.validated.body;

    const { data, error } = await supabase.from('categories').insert({ name, slug }).select().single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Category created successfully", data: data });
})

export default router