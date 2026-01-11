import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: Request) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/expenses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to fetch expenses' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch expenses' 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_URL}/api/expenses`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to create expense' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create expense' 
            },
            { status: 500 }
        );
    }
}
