import { NextResponse } from 'next/server'
import { DestinationService } from '@/services/destination.service'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

function CheckIfUserIsAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !CheckIfUserIsAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const destination = await DestinationService.updateDestination(id, data)
    return NextResponse.json(destination)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    )
  }
} 