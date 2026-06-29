import express from 'express'
import { supabaseAdmin, supabase } from '../dbconnect.js'
import { authAdminMiddleware, authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', (req, res) => {
    console.log("Got Auth route");
    res.send("Authentication Route");
})

router.post('/signup/user', async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const accountType = 'user';

    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                firstname: firstname,
                lastname: lastname
            }
        }
    });

    if(error){
        return res.status(500).json({error: error.message});
    }

    const {data: userData, error: userError} = await supabase.from('users').insert({user_id: data.user.id, first_name: firstname, last_name: lastname, email: email, phone: phone, account_type: accountType}).select();
    
    if(userError){
        return res.status(500).json({error: userError.message});
    }

    res.status(201).json({message: 'Account successfully created'});
})

router.post('/admin/create-user/:account_type', authMiddleware, authAdminMiddleware, async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const accountType = req.params.account_type;

    if(accountType != 'user' && accountType != 'admin' && accountType != 'business'){
        return res.status(400).json({message: 'Error creating account'});
    }

    const {data, error} = await supabaseAdmin.auth.admin.createUser({
        email: email,
        phone: phone,
        password: password,
        email_confirm: true,
        user_metadata: { firstname: firstname, lastname: lastname }
    });

    if(error){
        return res.status(500).json({error: error.message});
    }

    const {data: userData, error: userError} = await supabase.from('users').insert({user_id: data.user.id, first_name: firstname, last_name: lastname, email: email, phone: phone, account_type: accountType}).select();
    

    if(userError){
        return res.status(500).json({error: userError.message});
    }

    res.status(201).json({message: 'User succesfully created'});

})

router.post('/signup/business', async (req, res) => {
    const businessname = req.body.name;
    const businessdescription = req.body.description;
    const businessaddress = req.body.address;
    const businessemail = req.body.email;
    const businessphone = req.body.phone;
    const state = req.body.state;
    const city = req.body.city;
    const zip = req.body.zip;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;

    const slug = businessname.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const {data, error} = await supabase.auth.signUp({
        email: businessemail,
        password: password,
        options: {
            data: {
                firstname: firstname,
                lastname: lastname
            }
        }
    });

    if(error){
        return res.status(500).json({error: error.message});
    }

    const {data: userData, error: userError} = await supabase.from('users').insert({user_id: data.user.id, first_name: firstname, last_name: lastname, phone: businessphone, email: businessemail, account_type: 'business'}).select();

    if(userError){
        return res.status(500).json({error: userError.message});
    }

    const {data: businessData, error: businessError} = await supabase.from('businesses').insert({owner_user_id: data.user.id, name: businessname, description: businessdescription, address: businessaddress, city: city, state: state, zip: zip, phone: businessphone, email: businessemail, slug: slug}).select();

    if(businessError){
        return res.status(500).json({error: businessError.message});
    }

    return res.status(201).json({message: 'User and Business account successfully created'});

})

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const {data, error} = await supabase.auth.signInWithPassword({email: email, password: password});

    if(error){
        return res.status(401).json({error: error.message});
    }

    const {data: userData, error: userError} = await supabase.from('users').select('account_type').eq('user_id', data.user.id).single();

    if(userError){
        return res.status(500).json({error: userError.message});
    }

    return res.status(200).json({
        message: 'Successful log in',
        access_token: data.session.access_token,
        user_id: data.user.id,
        email: data.user.email,
        accountType: userData.account_type
    });
})

router.post('/logout', authMiddleware, async (req, res) => {

    const {error} = await supabase.auth.signOut();

    if(error){

        return res.status(500).json({error: error.message});
    }

    return res.status(200).json({message: 'User successfully signed out'});

})
export default router