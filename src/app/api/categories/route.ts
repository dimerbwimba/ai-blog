import { NextResponse } from 'next/server'
import { CategoryService } from '@/services/category.service'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

function CheckIfUserIsAdmin(session: {
  user:{
    role:'ADMIN'|'READER'|'WRITER'
  }
}) {
  return session?.user?.role === 'ADMIN'
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !CheckIfUserIsAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const categories = await CategoryService.getAllCategories()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !CheckIfUserIsAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const category = await CategoryService.createCategory(data)
    return NextResponse.json(category)
  } catch  {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const {id} = await request.json()
    console.log(id)
    await CategoryService.deleteCategory(id)
    return NextResponse.json({ message: 'Category deleted' })
  } 
  catch  {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}