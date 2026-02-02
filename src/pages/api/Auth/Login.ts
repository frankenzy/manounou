import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { telephone } = req.body;

    if (!telephone) {
      return res.status(400).json({ message: 'Le numéro de téléphone est requis' });
    }

    const result = await query('SELECT * FROM next_js.users WHERE telephone = $1', [telephone]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, telephone: user.telephone },
      process.env.JWT_SECRET || 'secret_par_defaut',
      { expiresIn: '24h' }
    );

    res.setHeader('Set-Cookie', `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);

    return res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        telephone: user.telephone
      }
    });

 
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
    
}
