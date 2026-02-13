export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;
        const utilisateur = await lireUtilisateur(id);
        res.status(200).json(utilisateur);
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}