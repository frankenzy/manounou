import { prisma } from '@/lib/prisma';
import { PostVisibility, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

type LegacyPostDto = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  parent_id?: null;
  location: string;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, unknown>;
  commentCount: number;
  repost: string;
  repostCount: number;
};

type IncomingPayload = {
  authorId?: string;
  user_id?: string;
  content?: string;
  description?: string;
  title?: string;
  location?: string;
  metaData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  visibility?: PostVisibility | string;
};

function toLegacyDto(post: {
  id: string;
  authorId: string;
  content: string;
  metaData: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { comments: number };
}): LegacyPostDto {
  const metadata = (post.metaData && typeof post.metaData === 'object' && !Array.isArray(post.metaData)
    ? post.metaData
    : {}) as Record<string, unknown>;

  return {
    id: post.id,
    user_id: post.authorId,
    title: typeof metadata.title === 'string' ? metadata.title : 'Nouvelle annonce',
    description: post.content,
    parent_id: null,
    location: typeof metadata.location === 'string' ? metadata.location : 'Non spécifié',
    created_at: post.createdAt,
    updated_at: post.updatedAt,
    metadata,
    commentCount: post._count?.comments ?? 0,
    repost: '',
    repostCount: 0,
  };
}

function normalizeVisibility(input?: PostVisibility | string): PostVisibility {
  if (input === 'FOLLOWERS' || input === 'PRIVATE' || input === 'PUBLIC') {
    return input;
  }
  return PostVisibility.PUBLIC;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const id = String(req.query.id || '').trim();

  if (!id) {
    return res.status(400).json({ success: false, message: 'Post id is required' });
  }

  try {
    switch (method) {
      case 'GET': {
        const post = await prisma.post.findUnique({
          where: { id },
          include: { _count: { select: { comments: true } } },
        });

        if (!post) {
          return res.status(404).json({ success: false, message: 'Annonce non trouvée' });
        }

        return res.status(200).json({ success: true, data: toLegacyDto(post) });
      }

      case 'PUT': {
        const payload = req.body as IncomingPayload;
        const updateData: Prisma.PostUncheckedUpdateInput = {};

        if (payload.authorId || payload.user_id) {
          updateData.authorId = String(payload.authorId ?? payload.user_id).trim();
        }

        if (payload.content !== undefined || payload.description !== undefined) {
          updateData.content = String(payload.content ?? payload.description ?? '').trim();
        }

        if (payload.visibility !== undefined) {
          updateData.visibility = normalizeVisibility(payload.visibility);
        }

        if (payload.metaData !== undefined || payload.metadata !== undefined || payload.title !== undefined || payload.location !== undefined) {
          const incomingMeta = (payload.metaData || payload.metadata || {}) as Record<string, unknown>;
          updateData.metaData = {
            ...incomingMeta,
            ...(payload.title ? { title: payload.title } : {}),
            ...(payload.location ? { location: payload.location } : {}),
          } as Prisma.InputJsonValue;
        }

        const updated = await prisma.post.update({
          where: { id },
          data: updateData,
          include: { _count: { select: { comments: true } } },
        });

        return res.status(200).json({
          success: true,
          data: toLegacyDto(updated),
          message: 'Annonce mise à jour avec succès',
        });
      }

      case 'DELETE': {
        await prisma.post.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Annonce supprimée avec succès' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({
          success: false,
          message: `Method ${method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error('Post by id API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}