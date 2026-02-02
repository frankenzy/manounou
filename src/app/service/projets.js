import projets from "../../api/projets";

const projects = projets.getProjets();
export default async function projects() {
  const response = await fetch("http://localhost:3000/api/projets");
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des projets");
  }
  const data = await response.json();
  return data;
}
export async function getProjets() {
  const response = await fetch("http://localhost:3000/api/projets");
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des projets");
  }
  const data = await response.json();
  return data;
}
export async function getProjetById(id) {
  const response = await fetch(`http://localhost:3000/api/projets/${id}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du projet");
  }
  const data = await response.json();
  return data;
}
export async function createProjet(projet) {
  const response = await fetch("http://localhost:3000/api/projets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projet),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la création du projet");
  }
  const data = await response.json();
  return data;
}
export async function updateProjet(id, projet) {
  const response = await fetch(`http://localhost:3000/api/projets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projet),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour du projet");
  }
  const data = await response.json();
  return data;
}
export async function deleteProjet(id) {
  const response = await fetch(`http://localhost:3000/api/projets/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du projet");
  }
  const data = await response.json();
  return data;
}
export async function getProjetsByUserId(userId) {
  const response = await fetch(
    `http://localhost:3000/api/projets/user/${userId}`
  );
  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des projets par utilisateur"
    );
  }
  const data = await response.json();
  return data;
}
