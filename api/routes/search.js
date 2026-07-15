import express from 'express';
import { supabase } from '../dbconnect.js';

const router = express.Router();

function groupServicesByBusiness(services = []) {
    const groupedBusinesses = new Map();

    for (const service of services) {
        const business = service.businesses;

        if (!business?.id) {
            continue;
        }

        if (!groupedBusinesses.has(business.id)) {
            groupedBusinesses.set(business.id, {
                business,
                bestMatch: service,
                matchingServices: [],
                matchCount: 0
            });
        }

        const groupedResult = groupedBusinesses.get(business.id);

        groupedResult.matchingServices.push(service);
        groupedResult.matchCount += 1;
    }

    return Array.from(groupedBusinesses.values());
}

router.get('/', async (req, res) => {
    try {
        console.log('Got searching route');

        const searchQuery =
            typeof req.query.q === 'string' ? req.query.q.trim() : '';

        const category =
            typeof req.query.category === 'string'
                ? req.query.category.trim()
                : '';

        const hasQuery = searchQuery.length > 0;

        if (!hasQuery && !category) {
            return res.json([]);
        }

        let categoryId = null;

        if (category) {
            const { data, error } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single();

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            categoryId = data.id;
        }

        // Category-only browse
        if (!hasQuery) {
            const { data, error } = await supabase
                .from('services')
                .select('*, businesses!inner(*)')
                .eq('category_id', categoryId)
                .eq('businesses.status', 'active');

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.json(groupServicesByBusiness(data));
        }

        const formattedQuery = searchQuery
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(/\s+/)
            .filter(Boolean)
            .join(' & ');

        let query = supabase
            .from('services')
            .select('*, businesses!inner(*)')
            .textSearch('search_vector', formattedQuery)
            .eq('businesses.status', 'active');

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        let { data, error } = await query;

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Exact/partial-name fallback
        if (data.length === 0) {
            let fallbackQuery = supabase
                .from('services')
                .select('*, businesses!inner(*)')
                .ilike('name', `%${searchQuery}%`)
                .eq('businesses.status', 'active');

            if (categoryId) {
                fallbackQuery = fallbackQuery.eq(
                    'category_id',
                    categoryId
                );
            }

            ({ data, error } = await fallbackQuery);
        }

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Fuzzy fallback
        if (data.length === 0) {
            const {
                data: fuzzyIds,
                error: fuzzyError
            } = await supabase.rpc('search_services_fuzzy', {
                search_term: searchQuery,
                filter_category_id: categoryId
            });

            if (fuzzyError) {
                return res.status(500).json({
                    error: fuzzyError.message
                });
            }

            const ids = fuzzyIds.map((result) => result.id);

            if (ids.length === 0) {
                return res.json([]);
            }

            ({ data, error } = await supabase
                .from('services')
                .select('*, businesses!inner(*)')
                .in('id', ids)
                .eq('businesses.status', 'active'));
        }

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.json(groupServicesByBusiness(data));
    } catch (error) {
        console.error('Search route error:', error);

        return res.status(500).json({
            error: 'An unexpected error occurred while searching.'
        });
    }
});

export default router;