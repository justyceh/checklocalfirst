import { supabase } from "../dbconnect.js";

export const authMiddleware = async (req, res, next) => {
    try{
    const tokenString = req.headers.authorization;

    if(!tokenString){
        return res.status(401).json({error: 'No token provided'});
    }

    const [bearerString, token] = tokenString.split(' ');

    const {data, error} = await supabase.auth.getUser(token);

    if(error){
        return res.status(401).json({error: 'User auth failed'});
    }

    req.user = data.user;
    next();
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}

export const authAdminMiddleware = async (req, res, next) => {

    try{

    
    
    const {data, error} = await supabase.from('users').select('account_type').eq('user_id', req.user.id).single();

    if(error){
        return res.status(500).json({error: 'Admin auth failed'});
    }

    if(data.account_type !== 'admin'){
        return res.status(403).json({error: 'Unauthorized'});
    }

    next();
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}