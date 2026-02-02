/**
 * API Route: GET/PUT/DELETE /api/announcements/[id]
 * Route handler pour une annonce spécifique
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnnouncementContainer } from '@/config/di-container';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   try {
      const { id } = await params;
      const announceId = parseInt(id, 10);
      if (isNaN(announceId)) {
         return NextResponse.json(
            { success: false, message: 'Invalid announcement ID' },
            { status: 400 },
         );
      }

      const useCase = AnnouncementContainer.getGetAnnouncementByIdUseCase();
      const announcement = await useCase.execute(announceId);

      return NextResponse.json({
         success: true,
         data: announcement,
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
         { success: false, message },
         { status: 404 },
      );
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   try {
      const { id } = await params;
      const announceId = parseInt(id, 10);
      if (isNaN(announceId)) {
         return NextResponse.json(
            { success: false, message: 'Invalid announcement ID' },
            { status: 400 },
         );
      }

      const body = await request.json();
      const useCase = AnnouncementContainer.getUpdateAnnouncementUseCase();
      const result = await useCase.execute(announceId, body);

      if (!result) {
         return NextResponse.json(
            { success: false, message: 'Announcement not found' },
            { status: 404 },
         );
      }

      return NextResponse.json({
         success: true,
         data: result,
         message: 'Annonce mise à jour avec succès',
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
         { success: false, message },
         { status: 400 },
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   try {
      const { id } = await params;
      const announceId = parseInt(id, 10);
      if (isNaN(announceId)) {
         return NextResponse.json(
            { success: false, message: 'Invalid announcement ID' },
            { status: 400 },
         );
      }

      const useCase = AnnouncementContainer.getDeleteAnnouncementUseCase();
      await useCase.execute(announceId);

      return NextResponse.json({
         success: true,
         message: 'Annonce supprimée avec succès',
      });
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
         { success: false, message },
         { status: 400 },
      );
   }
}
