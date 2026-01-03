import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const studentId = params.id;
        const body = await request.json();
        const { adminRole, adminId, adminUsername } = body;

        if (!studentId) {
            return NextResponse.json(
                { success: false, error: 'Student ID is required' },
                { status: 400 }
            );
        }

        // Forward request to Express backend
        const response = await fetch(`${BACKEND_URL}/api/admin/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                adminRole,
                adminId,
                adminUsername
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to delete student' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to delete student' 
            },
            { status: 500 }
        );
    }
}


