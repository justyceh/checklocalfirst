import express from 'express'
import { supabaseAdmin, supabase } from '../dbconnect.js'
import { authMiddleware, authAdminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware, authAdminMiddleware);


router.get('/businesses', async (req, res) => {
    const { data, error } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });

    if(error){
        return res.status(500).json({error: error.message});
    }

    res.status(200).json(data);
})

router.get('/businesses/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();

    if(error){
        return res.status(500).json({error: error.message});
    }

    res.status(200).json(data);
})

router.patch('/businesses/:id/status', async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    if(status !== 'active' && status !== 'suspended'){
        return res.status(400).json({error: 'Invalid status value'});
    }

    const { data, error } = await supabase.from('businesses').update({status}).eq('id', id).select();

    if(error){
        return res.status(500).json({error: error.message});
    }

    if(!data || data.length === 0){
        return res.status(404).json({error: 'Business not found'});
    }

    return res.status(200).json({message: 'Business status updated'});
})

router.delete('/businesses/:id', async (req, res) => {
    const id = req.params.id;

    const { data: businessData, error: businessError } = await supabase.from('businesses').select('owner_user_id').eq('id', id).single();

    if(businessError || !businessData){
        return res.status(404).json({error: 'Business not found'});
    }

    const { error: bizError } = await supabase.from('businesses').delete().eq('id', id);
    if(bizError){
        return res.status(500).json({error: bizError.message});
    }

    if(businessData.owner_user_id){
        const { error: userError } = await supabase.from('users').delete().eq('user_id', businessData.owner_user_id);
        if(userError){
            return res.status(500).json({error: userError.message});
        }

        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(businessData.owner_user_id);
        if(authError){
            return res.status(500).json({error: authError.message});
        }
    }

    return res.status(200).json({message: 'Business successfully deleted'});
})

router.get('/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });

    if(error){
        return res.status(500).json({error: error.message});
    }

    res.status(200).json(data);
})

router.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase.from('users').select('*').eq('user_id', id).single();

    if(error){
        return res.status(500).json({error: error.message});
    }

    res.status(200).json(data);
})

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    // 1. Self-lockout: can't delete your own admin account
    if (id === req.user.id) {
        return res.status(400).json({ error: 'You cannot delete your own admin account' });
    }

    // 2. Find the target user, and what type of account they are
    const { data: targetUser, error: targetError } = await supabase
        .from('users')
        .select('account_type')
        .eq('user_id', id)
        .single();

    if (targetError || !targetUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    // 3. If deleting an admin, make sure they aren't the last one
    if (targetUser.account_type === 'admin') {
        const { count, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('account_type', 'admin');

        if (countError) {
            return res.status(500).json({ error: countError.message });
        }

        if (count <= 1) {
            return res.status(400).json({ error: 'Cannot delete the last remaining admin account' });
        }
    }

    // 4. Delete from public.users (any owned business will auto SET NULL via migration 002)
    const { error: userError } = await supabase.from('users').delete().eq('user_id', id);
    if (userError) {
        return res.status(500).json({ error: userError.message });
    }

    // 5. Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) {
        return res.status(500).json({ error: authError.message });
    }

    return res.status(200).json({ message: 'User successfully deleted' });
})


router.get('/stats', async (req, res) => {
    const { count: totalBusinesses, error: businessError } = await supabase.from('businesses').select('*', { count: 'exact', head: true });

    if(businessError){
        return res.status(500).json({error: businessError.message});
    }

    const { count: totalUsers, error: userError } = await supabase.from('users').select('*', { count: 'exact', head: true });

    if(userError){
        return res.status(500).json({error: userError.message});
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: newSignups, error: signupError } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', twentyFourHoursAgo);

    if(signupError){
        return res.status(500).json({error: signupError.message});
    }

    return res.status(200).json({
        totalBusinesses,
        totalUsers,
        newSignupsLast24Hours: newSignups
    });
})



export default router