
import { users } from '/../../services/utilisateurs';


export default async function users(req, res) {
    console.log(db);
    if (req.method === 'GET') {
        const { rows } = await db.query('SELECT * FROM  next_js.users_table()');
        res.status(200).json(rows);
    }else {
        res.setHeader('Allow', ['GET']);
        res.status(405);
    }
}
