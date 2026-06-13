import express from 'express'
import { supabase } from '../dbconnect.js'
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router()

router.get('/', async (req, res) => {
    const { data, error} = await supabase.from('businesses').select('*');

    if(error){return res.status(500).json({error: error.message})}

    res.json(data);
})

router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();

    if(error){return res.status(500).json({ error: error.message })}

    res.json(data);
})

router.get('/:slug/services', async (req, res) => {
    const slug = req.params.slug;

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

router.put('/:slug/services/:id', authMiddleware, async (req, res) => {
    const slug = req.params.slug;
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category_id = req.body.category_id;

    const {data: businessData, error: businessError} = await supabase.from('businesses').select('owner_user_id').eq('slug', slug).single();

    if(businessError || !businessData){
        return res.status(404).json({error: 'Business not found'});
    }

    if(req.user.id !== businessData.owner_user_id){
        return res.status(403).json({message: 'Unauthorized can not update businesses services'});
    }

    const {data, error} = await supabase.from('services').update({name, description, price, category_id}).eq('id', id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Service for business updated'});

    
})

router.post('/:slug/services', authMiddleware, async (req, res) => {
    const slug = req.params.slug;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category_id = req.body.category_id;

    const {data: businessData, error: businessError} = await supabase.from('businesses').select('owner_user_id, id').eq('slug', slug).single();

    if(businessError || !businessData){
        return res.status(404).json({error: 'Business not found'});
    }

    if(req.user.id !== businessData.owner_user_id){
        return res.status(403).json({message: 'Unauthorized can not add service to business'});
    }

    const {data, error} = await supabase.from('services').insert({business_id: businessData.id, name, description, price, category_id});

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(201).json({message: 'Service for business added'});
})

router.delete('/:slug/services/:id', authMiddleware, async (req, res) => {
    const slug = req.params.slug;
    const id = req.params.id;


    const {data: businessData, error: businessError} = await supabase.from('businesses').select('owner_user_id').eq('slug', slug).single();

    if(businessError || !businessData){
        return res.status(404).json({error: 'Business not found'});
    }

    if(req.user.id !== businessData.owner_user_id){
        return res.status(403).json({message: 'Unauthorized can not add service to business'});
    }

    const {data, error} = await supabase.from('services').delete().eq('id', id);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'Service for business deleted'});
})

router.put('/:slug', authMiddleware, async (req, res) => {
    const slug = req.params.slug;
    const name = req.body.name;
    const description = req.body.description;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const phone = req.body.phone;
    const email = req.body.email;

    const {data: businessData, error: businessError} = await supabase.from('businesses').select('owner_user_id').eq('slug', slug).single();

    if(businessError || !businessData){
        return res.status(404).json({error: 'Business not found'});
    }

    if(req.user.id !== businessData.owner_user_id){
        return res.status(403).json({error: 'Unauthorized, can not access this business'});
    }

    const {data, error} = await supabase.from('businesses').update({name, description, address, city, state, zip, phone, email}).eq('slug', slug);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: `${name} successfully updated`});

})

router.delete('/:slug', authMiddleware, async (req, res) => {
    const slug = req.params.slug;
    console.log('1. Delete hit, slug:', slug);
    console.log('2. Requesting user id:', req.user.id);

    const {data: businessData, error: businessError} = await supabase.from('businesses').select('owner_user_id').eq('slug', slug).single();
    console.log('3. Business lookup result:', businessData, businessError);

    if(businessError || !businessData){
        return res.status(404).json({error: 'Could not find business'});
    }

    console.log('4. Owner check — business owner:', businessData.owner_user_id, '| requesting user:', req.user.id);
    if(businessData.owner_user_id !== req.user.id){
        return res.status(403).json({error: 'Not authorized to delete this business'});
    }

    const {data, error} = await supabase.from('businesses').delete().eq('slug', slug);
    console.log('5. Delete result:', data, error);

    if(error){
        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: `Business successfully deleted`})
})