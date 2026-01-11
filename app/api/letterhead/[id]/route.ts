import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const letterheadId = params.id;
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_URL}/api/letterhead/${letterheadId}`, {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to update letterhead' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating letterhead:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to update letterhead' 
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const letterheadId = params.id;

        const response = await fetch(`${BACKEND_URL}/api/letterhead/${letterheadId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to delete letterhead' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error deleting letterhead:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to delete letterhead' 
            },
            { status: 500 }
        );
    }
}
