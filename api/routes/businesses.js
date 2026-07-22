import express from 'express'
import { supabase, supabaseAdmin } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { verifyBusinessOwnership } from '../helpers/verifyBusinessOwnership.js';
import {
    businessSlugParamSchema,
    updateBusinessSchema,
    createServiceSchema,
    updateServiceSchema,
    serviceIdParamSchema
} from '../schemas/businessSchemas.js';

const router = express.Router()

router.get('/', async (req, res) => {
    const { data, error} = await supabase.from('businesses').select('*').eq('status', 'approved');

    if(error){return res.status(500).json({error: error.message})}

    res.json(data);
})

router.get('/me', authMiddleware, async (req, res) => {
    const { data, error } = await supabase.from('businesses').select('*').eq('owner_user_id', req.user.id).single();

    if(error){
        return res.status(404).json({error: 'Business not found'});
    }

    res.json(data);
})

router.get('/:slug', validate(businessSlugParamSchema), async (req, res) => {
    const { slug } = req.validated.params;
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).eq('status', 'approved').single();

    if(error){return res.status(500).json({ error: error.message })}

    res.json(data);
})

router.get('/:slug/services', validate(businessSlugParamSchema), async (req, res) => {
    const { slug } = req.validated.params;

    const {data, error} = await supabase.from('businesses').select('id').eq('slug', slug).single();

    if(error){
        return res.status(500).json({error: error.message});
    }

    const businessId = data.id;

    const {data: businessData, error: businessError} = await supabase.from('services').select('*').eq('business_id', businessId);

    if(businessError){
        return res.status(500).json({error: businessError.message});
    }

    return res.status(200).json({data: businessData});
})

router.put('/:slug/services/:id', authMiddleware, validate(updateServiceSchema), async (req, res) => {
    const { slug, id } = req.validated.params;
    const { name, description, category_id } = req.validated.body;

    const { handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('services').update({name, description, category_id}).eq('id', id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Service for business updated'});
})

router.post('/:slug/services', authMiddleware, validate(createServiceSchema), async (req, res) => {
    const { slug } = req.validated.params;
    const { name, description, category_id } = req.validated.body;

    const { businessData, handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('services').insert({business_id: businessData.id, name, description, category_id});

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(201).json({message: 'Service for business added'});
})

router.delete('/:slug/services/:id', authMiddleware, validate(serviceIdParamSchema), async (req, res) => {
    const { slug, id } = req.validated.params;

    const { handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('services').delete().eq('id', id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Service for business deleted'});
})

router.put('/:slug', authMiddleware, validate(updateBusinessSchema), async (req, res) => {
    const { slug } = req.validated.params;
    const { name, description, address, city, state, zip, phone, email } = req.validated.body;

    const { businessData, handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('businesses').update({name, description, address, city, state, zip, phone, email}).eq('slug', slug);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: `${name ?? businessData.name} successfully updated`});
})

router.delete('/:slug', authMiddleware, validate(businessSlugParamSchema), async (req, res) => {
    const { slug } = req.validated.params;

    const { businessData, handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {error: servicesError} = await supabase.from('services').delete().eq('business_id', businessData.id);
    if(servicesError) return res.status(500).json({error: servicesError.message});

    const {error: bizError} = await supabase.from('businesses').delete().eq('slug', slug);
    if(bizError) return res.status(500).json({error: bizError.message});

    const {error: userError} = await supabase.from('users').delete().eq('user_id', businessData.owner_user_id);
    if(userError) return res.status(500).json({error: userError.message});

    const {error: authError} = await supabaseAdmin.auth.admin.deleteUser(businessData.owner_user_id);
    if(authError) return res.status(500).json({error: authError.message});

    return res.status(200).json({message: 'Business successfully deleted'});
})

export default router