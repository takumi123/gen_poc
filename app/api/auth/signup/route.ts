import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/db"
import bcrypt from "bcryptjs"

type UserRole = "CLIENT" | "ENGINEER" | "ADMIN"

export async function POST(req: Request) {
  try {
    const { email, password, displayName, role } = await req.json()

    // バリデーション
    if (!email || !password || !displayName || !role) {
      return NextResponse.json(
        { message: "必須項目が入力されていません" },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に登録されています" },
        { status: 400 }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
        role: role as UserRole,
        status: "PENDING"
      }
    })

    return NextResponse.json(
      { message: "ユーザーが正常に作成されました", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("サインアップエラー:", error)
    return NextResponse.json(
      { message: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
