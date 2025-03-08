import React from "react";


const Login ={
  async loginService(telephone: string) {
    try {
      const response = await fetch('/api/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telephone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    }
  }
}

export default Login 