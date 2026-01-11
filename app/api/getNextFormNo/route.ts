import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const branch = searchParams.get('branch');

        if (!branch) {
            return NextResponse.json({ error: 'Branch is required' }, { status: 400 });
        }

        // Forward request to Express backend
        const response = await fetch(`${BACKEND_URL}/api/getNextFormNo?branch=${encodeURIComponent(branch)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: result.error || 'Failed to fetch form no' },
                { status: response.status }
            );
        }

        return NextResponse.json({ formNo: result.formNo });
    } catch (error) {
        console.error('Error fetching next form No:', error);
        return NextResponse.json(
            { error: 'Failed to fetch form no' },
            { status: 500 }
        );
    }
}
