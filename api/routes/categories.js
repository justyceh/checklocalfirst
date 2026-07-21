import express from 'express'
import { supabase } from '../dbconnect.js'
import { authAdminMiddleware, authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, categoryIdParamSchema } from '../schemas/categorySchemas.js';

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

router.delete('/:id', authMiddleware, authAdminMiddleware, validate(categoryIdParamSchema), async (req, res) => {
    const { id } = req.validated.params;

    const { data, error } = await supabase.from('categories').delete().eq('id', id).select().single();

    if (error) {
        // FK violation — category still has services attached
        if (error.code === '23503') {
            return res.status(409).json({ error: 'Cannot delete category: services are still assigned to it' });
        }
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
})

export default router