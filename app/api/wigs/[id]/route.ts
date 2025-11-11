import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wig from '@/models/Wig';
import { getCurrentUser } from '@/lib/auth';

// GET single wig
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const wig = await Wig.findById(id).populate('category');

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

// PUT update wig
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const wig = await Wig.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!wig) {
      return NextResponse.json(
        { success: false, error: 'Wig not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wig });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update wig' },
      { status: 400 }
    );
  }
}

// DELETE wig
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const wig = await Wig.findByIdAndDelete(id);

    if (!wig) {
      return NextResponse.json(
        { success: false, error: 'Wig not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete wig' },
      { status: 500 }
    );
  }
}
