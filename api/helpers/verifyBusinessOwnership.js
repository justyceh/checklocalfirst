// helpers/verifyBusinessOwnership.js
import { supabase } from '../dbconnect.js';

export async function verifyBusinessOwnership(slug, userId, res) {
    const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('owner_user_id, id')
        .eq('slug', slug)
        .single();

    if (businessError || !businessData) {
        res.status(404).json({ error: 'Business not found' });
        return { handled: true };
    }

    if (userId !== businessData.owner_user_id) {
        res.status(403).json({ error: 'Unauthorized: you do not own this business' });
        return { handled: true };
    }

    return { businessData };
}