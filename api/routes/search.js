import express from 'express'
import { supabase } from '../dbconnect.js'

const router = express.Router()

router.get('/', async (req, res) => {
    console.log("Got Searching route");
    const searchQuery = req.query.q;
    const category = req.query.category;
    const hasQuery = searchQuery !== "" && searchQuery !== undefined;

    if (!hasQuery && !category) {
        return res.status(400).json({ message: "No search term provided" });
    }

    let categoryId = '';
    if (category) {
        const { data, error } = await supabase.from('categories').select('id').eq('slug', category).single();
        if (error) return res.status(500).json({ error: error.message });
        categoryId = data.id;
    }

    // Category-only browse — skip all text search logic
    if (!hasQuery) {
        const { data, error } = await supabase
            .from('services')
            .select('*, businesses!inner(*)')
            .eq('category_id', categoryId)
            .eq('businesses.status', 'active');
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    }

    // Full three-tier text search (with optional category filter)
    const formattedQuery = searchQuery.trim().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).join(' & ');
    let query = supabase.from('services').select('*, businesses!inner(*)').textSearch('search_vector', formattedQuery).eq('businesses.status', 'active');
    if (categoryId) query = query.eq('category_id', categoryId);

    let { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    if (data.length === 0) {
        let fallbackQuery = supabase.from('services').select('*, businesses!inner(*)').ilike('name', `%${searchQuery}%`).eq('businesses.status', 'active');
        if (categoryId) fallbackQuery = fallbackQuery.eq('category_id', categoryId);
        ({ data, error } = await fallbackQuery);
    }

    if (error) return res.status(500).json({ error: error.message });

    if (data.length === 0) {
        const { data: fuzzyIds, error: fuzzyError } = await supabase.rpc('search_services_fuzzy', { search_term: searchQuery, filter_category_id: categoryId || null });
        if (fuzzyError) return res.status(500).json({ error: fuzzyError.message });
        const ids = fuzzyIds.map(r => r.id);
        ({ data, error } = await supabase.from('services').select('*, businesses!inner(*)').in('id', ids).eq('businesses.status', 'active'));
    }

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
})

export default router