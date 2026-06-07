import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    console.log("Got Searching route");
    const searchQuery = req.query.q;
    const category = req.query.category;
    let categoryId = '';
    if(category){
        const {data, error} = await supabase.from('categories').select('id').eq('slug', category).single();
        if(error){
            return res.status(500).json({error: error.message});
        }
        categoryId = data.id;
    }

    if(searchQuery === "" || searchQuery === undefined){
        return res.status(400).json({message: "No search term provided"});
    }

    
    const formattedQuery = searchQuery.trim().split(/\s+/).join(' & ');
    let query = supabase.from('services').select('*, businesses(*)').textSearch('search_vector', formattedQuery);


    if(categoryId){
        query = query.eq('category_id', categoryId);
    }

    let { data, error} = await query;

    if(error){return res.status(500).json({error: error.message})}

    if(data.length === 0){
        let fallbackquery = supabase.from('services').select('*, businesses(*)').ilike('name', `%${searchQuery}%`);
        if(categoryId){
            fallbackquery = fallbackquery.eq('category_id', categoryId);
        }

        ({data, error} = await fallbackquery);
    }

    if(error){return res.status(500).json({error: error.message})}

    if(data.length === 0){
    const { data: fuzzyIds, error: fuzzyError } = await supabase.rpc('search_services_fuzzy', { search_term: searchQuery, filter_category_id: categoryId || null });
    
    if(fuzzyError){ return res.status(500).json({error: fuzzyError.message}) }

    const ids = fuzzyIds.map(r => r.id);
    ({ data, error } = await supabase.from('services').select('*, businesses(*)').in('id', ids));
}

    if(error){return res.status(500).json({error: error.message})}

    res.json(data);

})

export default router