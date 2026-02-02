/**
 * API Route: GET /api/announcements
 * Route handler Next.js 13+ pour les annonces
 * Remplace progressivement les anciennes pages/api routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnnouncementContainer } from '@/config/di-container';

export async function GET(request: NextRequest) {
   try {
      const searchParams = request.nextUrl.searchParams;
      const query = searchParams.get('q');

      if (query) {
         // Recherche
         const useCase =
            AnnouncementContainer.getSearchAnnouncementsUseCase();
         const results = await useCase.execute(query);
         return NextResponse.json({
            success: true,
            data: results,
            count: results.length,
         });
      }

      // Get all
      const useCase = AnnouncementContainer.getGetAllAnnouncementsUseCase();
      const announcements = await useCase.execute();

      return NextResponse.json({
         success: true,
         data: announcements,
         count: announcements.length,
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ API Error:', message);
      return NextResponse.json(
         {
            success: false,
            message: message,
         },
         { status: 500 },
      );
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();

      const useCase = AnnouncementContainer.getCreateAnnouncementUseCase();
      const result = await useCase.execute(body);

      return NextResponse.json(
         {
            success: true,
            data: result,
            message: 'Annonce créée avec succès',
         },
         { status: 201 },
      );
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ API Error:', message);
      return NextResponse.json(
         {
            success: false,
            message: message,
         },
         { status: 400 },
      );
   }
}
