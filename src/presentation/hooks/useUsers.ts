/**
 * Hook: useUser
 * Hook personnalisé pour récupérer un utilisateur par ID
 */

import { UserResponseDTO } from '@/core/application/dto/User.dto';
import { useEffect, useState } from 'react';

export function useUser(id: number | null) {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();

        if (data.success) {
          setUser(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch user');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { user, isLoading, error };
}
