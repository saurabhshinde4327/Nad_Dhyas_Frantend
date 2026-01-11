import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const studentId = params.id;

        if (!studentId) {
            return NextResponse.json(
                { error: 'Student ID is required' },
                { status: 400 }
            );
        }

        // Forward request to Express backend
        const response = await fetch(`${BACKEND_URL}/api/student/${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: result.error || 'Failed to fetch student data' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Student Data Fetch Error:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch student data' 
            },
            { status: 500 }
        );
    }
}



