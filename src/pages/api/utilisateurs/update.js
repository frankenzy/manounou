import { mettreAJourUtilisateur } from '../../../services/utilisateurs';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id, nom, email } = req.body;
        await mettreAJourUtilisateur(id, nom, email);
        res.status(200).json({ message: 'Utilisateur mis à jour' });
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}