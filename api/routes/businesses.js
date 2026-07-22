import express from 'express'
import { supabase, supabaseAdmin } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { verifyBusinessOwnership } from '../helpers/verifyBusinessOwnership.js';
import { catchAsync } from '../helpers/catchAsync.js';
import { AppError } from '../helpers/AppError.js';
import {
    businessSlugParamSchema,
    updateBusinessSchema,
    createServiceSchema,
    updateServiceSchema,
    serviceIdParamSchema
} from '../schemas/businessSchemas.js';

const router = express.Router()

router.get('/', catchAsync(async (req, res) => {
    const { data, error} = await supabase.from('businesses').select('*').eq('status', 'approved');

    if(error){
        throw new AppError(error.message, 500);
    }

    res.json({ success: true, data });
}))

router.get('/me', authMiddleware, catchAsync(async (req, res) => {
    const { data, error } = await supabase.from('businesses').select('*').eq('owner_user_id', req.user.id).single();

    if(error){
        throw new AppError('Business not found', 404);
    }

    res.json({ success: true, data });
}))

router.get('/:slug', validate(businessSlugParamSchema), catchAsync(async (req, res) => {
    const { slug } = req.validated.params;
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).eq('status', 'approved').single();

    if(error){
        throw new AppError(error.message, 500);
    }

    res.json({ success: true, data });
}))

router.get('/:slug/services', validate(businessSlugParamSchema), catchAsync(async (req, res) => {
    const { slug } = req.validated.params;

    const {data, error} = await supabase.from('businesses').select('id').eq('slug', slug).single();

    if(error){
        throw new AppError(error.message, 500);
    }

    const businessId = data.id;

    const {data: businessData, error: businessError} = await supabase.from('services').select('*').eq('business_id', businessId);

    if(businessError){
        throw new AppError(businessError.message, 500);
    }

    return res.status(200).json({ success: true, data: businessData });
}))

router.put('/:slug/services/:id', authMiddleware, validate(updateServiceSchema), catchAsync(async (req, res) => {
    const { slug, id } = req.validated.params;
    const { name, description, category_id } = req.validated.body;

    const { handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('services').update({name, description, category_id}).eq('id', id);

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, message: 'Service for business updated' });
}))

router.post('/:slug/services', authMiddleware, validate(createServiceSchema), catchAsync(async (req, res) => {
    const { slug } = req.validated.params;
    const { name, description, category_id } = req.validated.body;

    const { businessData, handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('services').insert({business_id: businessData.id, name, description, category_id});

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(201).json({ success: true, message: 'Service for business added' });
}))

router.delete('/:slug/services/:id', authMiddleware, validate(serviceIdParamSchema), catchAsync(async (req, res) => {
    const { slug, id } = req.validated.params;

    const { handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('services').delete().eq('id', id);

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, message: 'Service for business deleted' });
}))

router.put('/:slug', authMiddleware, validate(updateBusinessSchema), catchAsync(async (req, res) => {
    const { slug } = req.validated.params;
    const { name, description, address, city, state, zip, phone, email } = req.validated.body;

    const { businessData, handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {data, error} = await supabase.from('businesses').update({name, description, address, city, state, zip, phone, email}).eq('slug', slug);

    if(error){
        throw new AppError(error.message, 500);
    }

    return res.status(200).json({ success: true, message: `${name ?? businessData.name} successfully updated` });
}))

router.delete('/:slug', authMiddleware, validate(businessSlugParamSchema), catchAsync(async (req, res) => {
    const { slug } = req.validated.params;

    const { businessData, handled } = await verifyBusinessOwnership(slug, req.user.id, res);
    if (handled) return;

    const {error: servicesError} = await supabase.from('services').delete().eq('business_id', businessData.id);
    if(servicesError) throw new AppError(servicesError.message, 500);

    const {error: bizError} = await supabase.from('businesses').delete().eq('slug', slug);
    if(bizError) throw new AppError(bizError.message, 500);

    const {error: userError} = await supabase.from('users').delete().eq('user_id', businessData.owner_user_id);
    if(userError) throw new AppError(userError.message, 500);

    const {error: authError} = await supabaseAdmin.auth.admin.deleteUser(businessData.owner_user_id);
    if(authError) throw new AppError(authError.message, 500);

    return res.status(200).json({ success: true, message: 'Business successfully deleted' });
}))

export default router