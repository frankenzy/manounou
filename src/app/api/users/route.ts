/**
 * API Route: GET/POST /api/users
 * Route handler pour les utilisateurs
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserContainer } from '@/config/di-container';

export async function GET(): Promise<NextResponse> {
   try {
      const useCase = UserContainer.getGetAllUsersUseCase();
      const users = await useCase.execute();

      return NextResponse.json({
         success: true,
         data: users,
         count: users.length,
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

      const useCase = UserContainer.getCreateUserUseCase();
      const result = await useCase.execute(body);

      return NextResponse.json(
         {
            success: true,
            data: result,
            message: 'User created successfully',
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
