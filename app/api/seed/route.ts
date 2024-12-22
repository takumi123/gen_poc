import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ダミーユーザーの作成
    const dummyClient = await prisma.user.upsert({
      where: { id: 'dummy-client-id' },
      update: {},
      create: {
        id: 'dummy-client-id',
        email: 'client@example.com',
        password: 'dummy-password',
        displayName: 'サンプル企業',
        role: 'CLIENT',
      },
    })

    const dummyEngineer = await prisma.user.upsert({
      where: { id: 'dummy-engineer-id' },
      update: {},
      create: {
        id: 'dummy-engineer-id',
        email: 'engineer@example.com',
        password: 'dummy-password',
        displayName: 'サンプルエンジニア',
        role: 'ENGINEER',
      },
    })

    return NextResponse.json({
      message: 'シードデータの作成が完了しました',
      users: [dummyClient, dummyEngineer],
    })
  } catch (error) {
    console.error('シードデータ作成エラー:', error)
    return NextResponse.json(
      { error: 'シードデータの作成に失敗しました' },
      { status: 500 }
    )
  }
}
