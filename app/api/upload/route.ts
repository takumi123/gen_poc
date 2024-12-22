import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from 'auth';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('認証が必要です', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return new NextResponse('ファイル名が必要です', { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('ファイルが必要です', { status: 400 });
    }

    // 画像ファイルのみを許可
    if (!file.type.startsWith('image/')) {
      return new NextResponse('画像ファイルのみアップロード可能です', { status: 400 });
    }

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('アップロードエラー:', error);
    return new NextResponse('内部サーバーエラー', { status: 500 });
  }
}
