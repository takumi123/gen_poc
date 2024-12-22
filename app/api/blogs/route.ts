import { prisma } from 'lib/db'
import { NextResponse } from 'next/server'
import { auth } from 'auth'

// ブログ記事一覧取得
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  try {
    const where = {
      ...(userId && { authorId: userId }),
      published: true,
    }

    const posts = await prisma.blogPost.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('ブログ記事一覧取得エラー:', error)
    return new NextResponse('内部サーバーエラー', { status: 500 })
  }
}

// ブログ記事作成
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('認証が必要です', { status: 401 })
  }

  try {
    const { title, content, published = false } = await request.json()

    // バリデーション
    if (!title || !content) {
      return new NextResponse('タイトルと本文は必須です', { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        published,
        authorId: session.user.id,
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('ブログ記事作成エラー:', error)
    return new NextResponse('内部サーバーエラー', { status: 500 })
  }
}
