export const articles = [
    {
      id: 1,
      title: "Introduction à Next.js",
      content: "Next.js est un framework React incroyable !",
      date: "2023-10-01",
    },
    {
      id: 2,
      title: "SSR vs SSG vs ISR",
      content: "Découvrez les différences entre SSR, SSG et ISR.",
      date: "2023-10-02",
    },
    {
      id: 3,
      title: "Créer un blog avec Next.js",
      content: "Apprenez à créer un blog en utilisant Next.js.",
      date: "2023-10-03",
    },
  ];

// Fonction pour récupérer un article par son ID
export function getArticleById(id) {
    return articles.find((article) => article.id === parseInt(id));
  }
  
  // Fonction pour récupérer tous les articles
  export function getAllArticles() {
    return articles;
  }
