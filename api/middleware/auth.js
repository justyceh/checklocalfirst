import { supabase } from "../dbconnect.js";

export const authMiddleware = async (req, res, next) => {
    const tokenString = req.headers.authorization;

    if(!tokenString){
        return res.status(401).json({error: 'No token provided'});
    }

    const [bearerString, token] = tokenString.split(' ');

    const {data, error} = await supabase.auth.getUser(token);

    if(error){
        return res.status(401).json({error: error.message});
    }

    req.user = data.user;
    next();
}