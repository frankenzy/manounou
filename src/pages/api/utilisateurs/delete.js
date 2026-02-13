
export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { id } = req.body;
        await supprimerUtilisateur(id);
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}