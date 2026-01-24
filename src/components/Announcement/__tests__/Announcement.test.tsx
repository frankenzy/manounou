/**
 * Exemples de tests pour le module Announcement
 * 
 * Ces tests démontrent la facilité de tester chaque partie
 * grâce à la séparation des responsabilités
 */

// ============================================
// 1. Tests du Hook useAnnouncementForm
// ============================================

import { act, renderHook } from '@testing-library/react';
import { useAnnouncementForm } from '../useAnnouncementForm';

describe('useAnnouncementForm', () => {
   it('devrait initialiser avec des valeurs vides', () => {
      const { result } = renderHook(() => useAnnouncementForm());

      expect(result.current.inputValue).toBe('');
      expect(result.current.announcementTitle).toBe('');
      expect(result.current.inputBg).toBe('');
   });

   it('devrait pré-remplir le formulaire en mode édition', () => {
      const mockAnnouncement = {
         id: 1,
         title: 'Test Annonce',
         description: 'Description test',
         metadata: {
            background: 'bg-orange-500',
         },
      };

      const { result } = renderHook(() => useAnnouncementForm(mockAnnouncement));

      expect(result.current.announcementTitle).toBe('Test Annonce');
      expect(result.current.inputValue).toBe('Description test');
   });

   it('devrait gérer le changement de couleur', () => {
      const { result } = renderHook(() => useAnnouncementForm());

      act(() => {
         result.current.handleInputBg('bg-green-600');
      });

      expect(result.current.metadata.background).toBe('bg-green-600');
      expect(result.current.inputBg).toContain('bg-green-600');
   });

   it('devrait reset le formulaire', () => {
      const { result } = renderHook(() => useAnnouncementForm());

      act(() => {
         result.current.handleInputBg('bg-red-500');
         result.current.resetForm();
      });

      expect(result.current.inputValue).toBe('');
      expect(result.current.inputBg).toBe('bg-white');
   });

   it('devrait retourner les données du formulaire formatées', () => {
      const { result } = renderHook(() => useAnnouncementForm());

      act(() => {
         result.current.setAnnouncementTitle('Nouveau titre');
         result.current.handleInput({
            target: { value: 'Nouvelle description' }
         } as any);
      });

      const formData = result.current.getFormData();

      expect(formData.title).toBe('Nouveau titre');
      expect(formData.description).toBe('Nouvelle description');
   });
});

// ============================================
// 2. Tests du Hook useAnnouncementSubmit
// ============================================

import { waitFor } from '@testing-library/react';
import { useAnnouncementSubmit } from '../useAnnouncementSubmit';

// Mock fetch
global.fetch = jest.fn();

describe('useAnnouncementSubmit', () => {
   beforeEach(() => {
      (fetch as jest.Mock).mockClear();
   });

   it('devrait créer une annonce avec succès', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
         json: async () => ({ success: true, data: { id: 1 } }),
      });

      const { result } = renderHook(() => useAnnouncementSubmit());

      let response;
      await act(async () => {
         response = await result.current.createAnnouncement({
            title: 'Test',
            description: 'Description',
            metadata: {} as any,
         });
      });

      expect(response.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
         '/api/announcements',
         expect.objectContaining({ method: 'POST' })
      );
   });

   it('devrait gérer les erreurs de création', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAnnouncementSubmit());

      let response;
      await act(async () => {
         response = await result.current.createAnnouncement({
            title: 'Test',
            description: 'Description',
            metadata: {} as any,
         });
      });

      expect(response.success).toBe(false);
      expect(result.current.error).toBeTruthy();
   });

   it('devrait mettre à jour une annonce', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
         json: async () => ({ success: true, data: { id: 1 } }),
      });

      const { result } = renderHook(() => useAnnouncementSubmit());

      let response;
      await act(async () => {
         response = await result.current.updateAnnouncement(
            1,
            {
               title: 'Updated',
               description: 'Updated description',
               metadata: {} as any,
            },
            { id: 1, user_id: '1' } as any
         );
      });

      expect(response.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
         '/api/announcements/1',
         expect.objectContaining({ method: 'PUT' })
      );
   });

   it('devrait afficher isSubmitting pendant la requête', async () => {
      (fetch as jest.Mock).mockImplementation(
         () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useAnnouncementSubmit());

      act(() => {
         result.current.createAnnouncement({
            title: 'Test',
            description: 'Description',
            metadata: {} as any,
         });
      });

      expect(result.current.isSubmitting).toBe(true);

      await waitFor(() => {
         expect(result.current.isSubmitting).toBe(false);
      });
   });
});

// ============================================
// 3. Tests du Composant AnnouncementForm
// ============================================

import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import AnnouncementForm from '../AnnouncementCreateForm';

describe('AnnouncementForm', () => {
   const mockProps = {
      inputValue: '',
      inputBg: '',
      inputColor: '',
      showUploadImage: false,
      announcementTitle: '',
      textareaRef: createRef<HTMLTextAreaElement>(),
      onInput: jest.fn(),
      onTitleChange: jest.fn(),
      onColorSelect: jest.fn(),
      onResetStyles: jest.fn(),
      onLoadImage: jest.fn(),
      onImageUpload: jest.fn(),
      onImageRemove: jest.fn(),
      onSetUser: jest.fn(),
      onSetCalendar: jest.fn(),
      onSetIdCard: jest.fn(),
   };

   it('devrait afficher le textarea', () => {
      render(<AnnouncementForm {...mockProps} />);

      const textarea = screen.getByPlaceholderText('Décrire votre publication...');
      expect(textarea).toBeInTheDocument();
   });

   it('devrait appeler onInput lors de la saisie', () => {
      render(<AnnouncementForm {...mockProps} />);

      const textarea = screen.getByPlaceholderText('Décrire votre publication...');
      fireEvent.change(textarea, { target: { value: 'Test' } });

      expect(mockProps.onInput).toHaveBeenCalled();
   });

   it('devrait afficher les boutons de couleur', () => {
      render(<AnnouncementForm {...mockProps} />);

      const colorButtons = screen.getAllByRole('button');
      expect(colorButtons.length).toBeGreaterThan(5); // 5 couleurs + reset + icônes
   });

   it('devrait appeler onColorSelect au clic sur une couleur', () => {
      const { container } = render(<AnnouncementForm {...mockProps} />);

      const orangeButton = container.querySelector('.bg-orange-500');
      fireEvent.click(orangeButton!);

      expect(mockProps.onColorSelect).toHaveBeenCalledWith(
         expect.stringContaining('orange')
      );
   });

   it('devrait afficher le composant upload si showUploadImage est true', () => {
      render(<AnnouncementForm {...mockProps} showUploadImage={true} />);

      // Vérifier la présence du composant UploadImage
      // (nécessite un mock ou un test d'intégration)
   });
});

// ============================================
// 4. Tests du Modal AnnouncementModal
// ============================================

import AnnouncementModal from '../AnnouncementModal';

describe('AnnouncementModal', () => {
   const mockProps = {
      isOpen: true,
      onClose: jest.fn(),
      onSuccess: jest.fn(),
   };

   it('ne devrait rien afficher si isOpen est false', () => {
      const { container } = render(
         <AnnouncementModal {...mockProps} isOpen={false} />
      );

      expect(container.firstChild).toBeNull();
   });

   it('devrait afficher le titre "Publier une annonce" en mode création', () => {
      render(<AnnouncementModal {...mockProps} />);

      expect(screen.getByText('Publier une annonce')).toBeInTheDocument();
   });

   it('devrait afficher le titre "Modifier l\'annonce" en mode édition', () => {
      const announcement = {
         id: 1,
         title: 'Test',
         description: 'Test',
      } as any;

      render(<AnnouncementModal {...mockProps} announcement={announcement} />);

      expect(screen.getByText("Modifier l'annonce")).toBeInTheDocument();
   });

   it('devrait appeler onClose lors du clic sur le bouton fermer', () => {
      render(<AnnouncementModal {...mockProps} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockProps.onClose).toHaveBeenCalled();
   });

   it('devrait afficher le bouton "Suivant" en mode création', () => {
      render(<AnnouncementModal {...mockProps} />);

      expect(screen.getByText('Suivant')).toBeInTheDocument();
   });

   it('devrait afficher le bouton "Mettre à jour" en mode édition', () => {
      const announcement = {
         id: 1,
         title: 'Test',
         description: 'Test',
      } as any;

      render(<AnnouncementModal {...mockProps} announcement={announcement} />);

      expect(screen.getByText('Mettre à jour')).toBeInTheDocument();
   });

   it('devrait désactiver le bouton pendant la soumission', async () => {
      // Mock fetch pour simuler un délai
      (fetch as jest.Mock).mockImplementation(
         () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<AnnouncementModal {...mockProps} />);

      const submitButton = screen.getByText('Suivant');
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(submitButton).toBeDisabled();
      });
   });

   it('devrait appeler onSuccess après une soumission réussie', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
         json: async () => ({ success: true, data: { id: 1 } }),
      });

      render(<AnnouncementModal {...mockProps} />);

      const submitButton = screen.getByText('Suivant');
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockProps.onSuccess).toHaveBeenCalled();
      });
   });
});

// ============================================
// 5. Tests d'intégration
// ============================================

describe('AnnouncementModal Integration', () => {
   it('devrait permettre de créer une annonce de bout en bout', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
         json: async () => ({ success: true, data: { id: 1 } }),
      });

      const onSuccess = jest.fn();

      render(
         <AnnouncementModal
            isOpen={true}
            onClose={jest.fn()}
            onSuccess={onSuccess}
         />
      );

      // Remplir le formulaire
      const textarea = screen.getByPlaceholderText('Décrire votre publication...');
      fireEvent.change(textarea, { target: { value: 'Ma nouvelle annonce' } });

      // Soumettre
      const submitButton = screen.getByText('Suivant');
      fireEvent.click(submitButton);

      // Vérifier l'appel API
      await waitFor(() => {
         expect(fetch).toHaveBeenCalledWith(
            '/api/announcements',
            expect.objectContaining({
               method: 'POST',
               body: expect.stringContaining('Ma nouvelle annonce'),
            })
         );
      });

      // Vérifier le callback de succès
      await waitFor(() => {
         expect(onSuccess).toHaveBeenCalled();
      });
   });
});
