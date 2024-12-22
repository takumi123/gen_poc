import { prisma } from 'lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'auth'

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'ブログ記事が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('ブログ記事取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    )
  }

  try {
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'ブログ記事が見つかりません' },
        { status: 404 }
      )
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const { title, content, published } = await request.json()

    // バリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと本文は必須です' },
        { status: 400 }
      )
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        published,
        ...(published ? { publishedAt: new Date() } : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('ブログ記事更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    )
  }

  try {
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'ブログ記事が見つかりません' },
        { status: 404 }
      )
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    await prisma.blogPost.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('ブログ記事削除エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
