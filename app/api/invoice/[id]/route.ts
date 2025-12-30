import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Forward request to Express backend
        const response = await fetch(`${BACKEND_URL}/api/invoice/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: result.error || 'Failed to fetch invoice' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Invoice Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice' },
            { status: 500 }
        );
    }
}
