export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nom, email } = req.body;
        await creerUtilisateur(nom, email);
        res.status(201).json({ message: 'Utilisateur créé' });
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}