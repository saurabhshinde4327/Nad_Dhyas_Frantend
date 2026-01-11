import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const studentId = params.id;
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/student/${studentId}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to process payment' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to process payment' 
            },
            { status: 500 }
        );
    }
}
