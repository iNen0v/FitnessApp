import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"  

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { food, portion, nutrients } = body

    const analysis = await prisma.foodAnalysis.create({
      data: {
        userId: session.user.id,
        food,
        portion,
        nutrients
      }
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error saving food analysis:', error)
    return NextResponse.json(
      { error: 'Failed to save food analysis' },
      { status: 500 }
    )
  }
}