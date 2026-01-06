export class QueryService {



    // publication d'announce

    constructor (){

    }


    async publishAnnouncement(title: string, description: string, price: number, userId: number) {
        try {
            const response = await fetch('/api/Announcements/Publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, price, userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la publication de l\'annonce');
            }

            return {
                success: true,
                data
            };
        }
        catch (error) {
            console.error('Erreur de publication de l\'annonce:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Une erreur est survenue'
            };
        }
    
    }
}