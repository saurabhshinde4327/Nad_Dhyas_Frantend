import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const expenseId = params.id;
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_URL}/api/expenses/${expenseId}`, {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to update expense' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating expense:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to update expense' 
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
        const expenseId = params.id;

        const response = await fetch(`${BACKEND_URL}/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to delete expense' },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error deleting expense:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to delete expense' 
            },
            { status: 500 }
        );
    }
}
