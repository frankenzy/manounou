import { query } from '../lib/db';

export async function creerUtilisateur(nom, email) {
    await query('SELECT next_js.add_user($1, $2,$3)', [pseudo,email, mot_de_passe]);
}

export async function lireUtilisateur(id) {
    const result = await query('SELECT next_js.read_user($1)', [id]);
    return result.rows[0];
}


export async function mettreAJourUtilisateur(id, nom, email) {
    await query('SELECT next_js.update_user($1, $2, $3,$4)', [id, pseudo, email,password]);
}


export async function supprimerUtilisateur(id) {
    await query('SELECT next_js.delete_user($1)', [id]);
}