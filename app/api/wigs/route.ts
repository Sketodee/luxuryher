import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wig from '@/models/Wig';
import { getCurrentUser } from '@/lib/auth';

// GET all wigs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    const filter: any = {};
    if (category) filter.category = category;
    if (available) filter.available = available === 'true';

    const wigs = await Wig.find(filter)
      .populate('category')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: wigs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wigs' },
      { status: 500 }
    );
  }
}

// POST create new wig
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Calculate final price
    if (body.price !== undefined) {
      const discount = body.discount || 0;
      const discountAmount = (body.price * discount) / 100;
      body.finalPrice = body.price - discountAmount;
    }

    const wig = await Wig.create(body);
    return NextResponse.json({ success: true, data: wig }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create wig' },
      { status: 400 }
    );
  }
}
