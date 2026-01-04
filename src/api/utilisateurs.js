import db from '../../lib/db';

export default async function users(req, res) {
    if (req.method === 'GET') {
        const { rows } = await db.query('SELECT * FROM utilisateurs');
        res.status(200).json(rows);
    }else {
        res.setHeader('Allow', ['GET']);
        res.status(405);
    }
}
