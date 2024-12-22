import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

// PrismaClientのグローバルインスタンス
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 開発環境での重複インスタンス化を防ぐ
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Blobストレージの接続テスト関数
export async function testBlobConnection() {
  try {
    const test = new Uint8Array([1, 2, 3])
    const blob = await put('test.txt', test, {
      access: 'public',
    })
    console.log('Blob接続成功:', blob)
    return true
  } catch (error) {
    console.error('Blob接続エラー:', error)
    return false
  }
}
