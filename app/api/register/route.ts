import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Forward request to Express backend
        const response = await fetch(`${BACKEND_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Registration failed' },
                { status: response.status }
            );
        }

        // Return response with studentId for compatibility
        return NextResponse.json(
            { 
                success: true, 
                id: result.id,
                studentId: result.studentId || result.id,
                formNo: result.formNo,
                invoiceNumber: result.invoiceNumber
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Registration failed' 
            },
            { status: 500 }
        );
    }
}
