import express from 'express'
import { supabaseAdmin, supabase } from '../dbconnect.js'
import { authMiddleware, authAdminMiddleware } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { businessIdParamSchema, userIdParamSchema, updateBusinessStatusSchema } from '../schemas/adminSchemas.js'
import { catchAsync } from '../helpers/catchAsync.js';
import { AppError } from '../helpers/AppError.js';

const router = express.Router()

router.use(authMiddleware, authAdminMiddleware);


router.get('/businesses', catchAsync(async (req, res) => {
    const { data, error } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });

    if(error){
        throw new AppError(error.message, 500);
    }

    res.status(200).json({ success: true, data });
}))

router.get('/businesses/:id', validate(businessIdParamSchema), catchAsync(async (req, res) => {
    const { id } = req.validated.params;

    const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();

    if(error){
        throw new AppError(error.message, 500);
    }

    res.status(200).json({ success: true, data });
}))

router.patch('/businesses/:id/status', validate(updateBusinessStatusSchema), catchAsync(async (req, res) => {
    const { id } = req.validated.params;
    const { status } = req.validated.body;

    const { data, error } = await supabaseAdmin.from('businesses').update({status}).eq('id', id).select().single();

    if(error){
        throw new AppError(error.message, 500);
    }

    if(!data){
        throw new AppError('Business not found', 404);
    }

    return res.status(200).json({ success: true, message: 'Business status updated' });
}))

router.delete('/businesses/:id', validate(businessIdParamSchema), catchAsync(async (req, res) => {
    const { id } = req.validated.params;

    const { data: businessData, error: businessError } = await supabase.from('businesses').select('owner_user_id').eq('id', id).single();

    if(businessError || !businessData){
        throw new AppError('Business not found', 404);
    }

    const { error: bizError } = await supabase.from('businesses').delete().eq('id', id);
    if(bizError){
        throw new AppError(bizError.message, 500);
    }

    if(businessData.owner_user_id){
        const { error: userError } = await supabase.from('users').delete().eq('user_id', businessData.owner_user_id);
        if(userError){
            throw new AppError(userError.message, 500);
        }

        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(businessData.owner_user_id);
        if(authError){
            throw new AppError(authError.message, 500);
        }
    }

    return res.status(200).json({ success: true, message: 'Business successfully deleted' });
}))

router.get('/users', catchAsync(async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });

    if(error){
        throw new AppError(error.message, 500);
    }

    res.status(200).json({ success: true, data });
}))

router.get('/users/:id', validate(userIdParamSchema), catchAsync(async (req, res) => {
    const { id } = req.validated.params;

    const { data, error } = await supabase.from('users').select('*').eq('user_id', id).single();

    if(error){
        throw new AppError(error.message, 500);
    }

    res.status(200).json({ success: true, data });
}))

router.delete('/users/:id', validate(userIdParamSchema), catchAsync(async (req, res) => {
    const { id } = req.validated.params;

    if (id === req.user.id) {
        throw new AppError('You cannot delete your own admin account', 400);
    }

    const { data: targetUser, error: targetError } = await supabase
        .from('users')
        .select('account_type')
        .eq('user_id', id)
        .single();

    if (targetError || !targetUser) {
        throw new AppError('User not found', 404);
    }

    if (targetUser.account_type === 'admin') {
        const { count, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('account_type', 'admin');

        if (countError) {
            throw new AppError(countError.message, 500);
        }

        if (count <= 1) {
            throw new AppError('Cannot delete the last remaining admin account', 400);
        }
    }

    const { error: userError } = await supabase.from('users').delete().eq('user_id', id);
    if (userError) {
        throw new AppError(userError.message, 500);
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) {
        throw new AppError(authError.message, 500);
    }

    return res.status(200).json({ success: true, message: 'User successfully deleted' });
}))


router.get('/stats', catchAsync(async (req, res) => {
    const { count: totalBusinesses, error: businessError } = await supabase.from('businesses').select('*', { count: 'exact', head: true });

    if(businessError){
        throw new AppError(businessError.message, 500);
    }

    const { count: totalUsers, error: userError } = await supabase.from('users').select('*', { count: 'exact', head: true });

    if(userError){
        throw new AppError(userError.message, 500);
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: newSignups, error: signupError } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', twentyFourHoursAgo);

    if(signupError){
        throw new AppError(signupError.message, 500);
    }

    return res.status(200).json({
        success: true,
        data: {
            totalBusinesses,
            totalUsers,
            newSignupsLast24Hours: newSignups
        }
    });
}))



export default router