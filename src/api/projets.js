import db from "../../lib/db";
export default async function getProjets(_req, res) {
  const { rows } = await db.query("SELECT * FROM projets");
  res.status(200).json(rows);
}
