import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wig from '@/models/Wig';

// GET wig by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();
    const wig = await Wig.findOne({ slug }).populate('category');

    if (!wig) {
      return NextResponse.json(
        { success: false, error: 'Wig not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wig });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wig' },
      { status: 500 }
    );
  }
}
