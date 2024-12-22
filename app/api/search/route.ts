import { prisma } from 'lib/db'
import { ProjectStatus, SearchType, UserRole } from 'app/types'
import { NextResponse } from 'next/server'
import { auth } from 'auth'

type WhereInput = {
  [key: string]: string | number | boolean | object | undefined;
}

type BlogSearchParams = WhereInput & {
  published: boolean;
  OR?: {
    title?: { contains: string; mode: 'insensitive' };
    content?: { contains: string; mode: 'insensitive' };
  }[];
}

type ProjectSearchParams = WhereInput & {
  status?: ProjectStatus;
  requiredSkills?: {
    array_contains?: string[];
  };
  budget?: {
    lte?: number;
    gt?: number;
  };
  startDate?: {
    gte: Date;
  };
}

type CompanySearchParams = WhereInput & {
  role: UserRole;
  isProfilePublic: boolean;
  OR?: {
    companyName?: { contains: string; mode: 'insensitive' };
    industry?: { contains: string; mode: 'insensitive' };
    bio?: { contains: string; mode: 'insensitive' };
  }[];
  industry?: { contains: string; mode: 'insensitive' };
  location?: { contains: string; mode: 'insensitive' };
  companySize?: {
    gte: number;
    lte?: number;
  };
}

type EngineerSearchParams = WhereInput & {
  role: UserRole;
  isProfilePublic: boolean;
  OR?: {
    displayName?: { contains: string; mode: 'insensitive' };
    bio?: { contains: string; mode: 'insensitive' };
  }[];
  skills?: {
    path: '$';
    array_contains: string[];
  };
  experienceYears?: {
    gte: number;
  };
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const searchType = (searchParams.get('type') as SearchType) || SearchType.PROJECT

  switch (searchType) {
    case SearchType.PROJECT:
      return await searchProjects(searchParams)
    case SearchType.COMPANY:
      return await searchCompanies(searchParams)
    case SearchType.ENGINEER:
      return await searchEngineers(searchParams)
    case SearchType.BLOG:
      return await searchBlogs(searchParams)
    default:
      return new NextResponse('Invalid search type', { status: 400 })
  }
}

async function searchBlogs(searchParams: URLSearchParams) {
  try {
    const where: BlogSearchParams = {
      published: true,
    }

    const keyword = searchParams.get('keyword')
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    const blogs = await prisma.blogPost.findMany({
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

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('ブログ検索エラー:', error)
    return new NextResponse('内部サーバーエラー', { status: 500 })
  }
}

async function searchProjects(searchParams: URLSearchParams) {
  const where: ProjectSearchParams = {
    status: (searchParams.get('status') as ProjectStatus) || ProjectStatus.OPEN,
  }

  const skills = searchParams.get('skills')
  if (skills) {
    where.requiredSkills = {
      array_contains: skills.split(',').map(skill => skill.trim()),
    }
  }

  if (searchParams.get('budget')) {
    switch (searchParams.get('budget')) {
      case '〜50万円':
        where.budget = { lte: 500000 }
        break
      case '50万円〜80万円':
        where.budget = { gt: 500000, lte: 800000 }
        break
      case '80万円〜100万円':
        where.budget = { gt: 800000, lte: 1000000 }
        break
      case '100万円〜':
        where.budget = { gt: 1000000 }
        break
    }
  }

  const startDate = searchParams.get('startDate')
  if (startDate) {
    where.startDate = {
      gte: new Date(startDate),
    }
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      user: true,
      _count: {
        select: {
          proposals: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(projects)
}

async function searchCompanies(searchParams: URLSearchParams) {
  const where: CompanySearchParams = {
    role: UserRole.CLIENT,
    isProfilePublic: true,
  }

  const keyword = searchParams.get('keyword')
  if (keyword) {
    where.OR = [
      { companyName: { contains: keyword, mode: 'insensitive' } },
      { industry: { contains: keyword, mode: 'insensitive' } },
      { bio: { contains: keyword, mode: 'insensitive' } },
    ]
  }

  const industry = searchParams.get('industry')
  if (industry) {
    where.industry = { contains: industry, mode: 'insensitive' }
  }

  const location = searchParams.get('location')
  if (location) {
    where.location = { contains: location, mode: 'insensitive' }
  }

  const size = searchParams.get('size')
  if (size) {
    const [min, max] = size.split('-').map(Number)
    where.companySize = {
      gte: min,
      ...(max ? { lte: max } : {}),
    }
  }

  const companies = await prisma.user.findMany({
    where,
    select: {
      id: true,
      displayName: true,
      profileImageUrl: true,
      bio: true,
      companyName: true,
      companySize: true,
      industry: true,
      location: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(companies)
}

async function searchEngineers(searchParams: URLSearchParams) {
  const where: EngineerSearchParams = {
    role: UserRole.ENGINEER,
    isProfilePublic: true,
  }

  const keyword = searchParams.get('keyword')
  if (keyword) {
    where.OR = [
      { displayName: { contains: keyword, mode: 'insensitive' } },
      { bio: { contains: keyword, mode: 'insensitive' } },
    ]
  }

  const skills = searchParams.get('skills')
  if (skills) {
    where.skills = {
      path: '$',
      array_contains: skills.split(',').map(s => s.trim()),
    }
  }

  const experienceYears = searchParams.get('experienceYears')
  if (experienceYears) {
    where.experienceYears = {
      gte: Number(experienceYears),
    }
  }

  const engineers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      displayName: true,
      profileImageUrl: true,
      bio: true,
      skills: true,
      experienceYears: true,
      portfolioUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(engineers)
}
