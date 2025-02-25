import { NextResponse } from 'next/server'
import { DestinationService } from '@/services/destination.service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function CheckIfUserIsAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
} 

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !CheckIfUserIsAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const destinations = await DestinationService.getAllDestinations()
    return NextResponse.json(destinations)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
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
    const destination = await DestinationService.createDestination(data)
    return NextResponse.json(destination)
  } catch  {
    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const {id} = await request.json()
    const destination = await DestinationService.deleteDestination(id)
    return NextResponse.json(destination)
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete destination' },
      { status: 500 }
    )
  }
}