import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { branch, search, adminRole, adminBranch, adminId, adminUsername } = body;

        // Forward request to Express backend with admin info
        const response = await fetch(`${BACKEND_URL}/api/admin/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                branch,
                search,
                adminRole,
                adminBranch,
                adminId,
                adminUsername
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to fetch students' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch students' 
            },
            { status: 500 }
        );
    }
}

