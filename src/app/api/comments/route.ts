import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { commentService } from '@/services/commentService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');
    const isAdminView = searchParams.get('admin') === 'true';

    if (isAdminView) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const comments = await commentService.getAllCommentsAdmin();
      return NextResponse.json(comments);
    } else {
      if (!articleId) {
        return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
      }
      const comments = await commentService.getCommentsForArticle(articleId);
      return NextResponse.json(comments);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { articleId, name, email, content } = await req.json();

    if (!articleId || !name || !email || !content) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const comment = await commentService.createComment({
      articleId,
      name,
      email,
      content,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, approved } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    let updatedComment;
    if (approved) {
      updatedComment = await commentService.approveComment(id);
    } else {
      // If we need to unapprove (moderate back)
      await dbConnectUpdateFallback(id, false);
      updatedComment = { id, approved: false };
    }

    if (!updatedComment) {
      return NextResponse.json({ error: 'Comment not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json(updatedComment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fallback direct database update for un-approval in PUT if needed
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
async function dbConnectUpdateFallback(id: string, approved: boolean) {
  await dbConnect();
  await Comment.findByIdAndUpdate(id, { approved });
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const success = await commentService.deleteComment(id);
    if (!success) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
