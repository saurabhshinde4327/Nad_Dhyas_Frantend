'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface InvoiceData {
    fullName: string;
    invoiceNumber: string;
    formNo: string | null;
    panCard: string | null;
    aadharCard: string | null;
    phone: string | null;
    diplomaAdmissionYear: string | null;
    date: string;
    branch: string;
    course: string;
    amount: number;
    transactionId: string;
}

export default function InvoicePage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [serialNo, setSerialNo] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        // In a real app, you would fetch from an API like /api/invoice/[id]
        // But since we just created the record in Mongo, let's fetch it via a new API endpoint or simlulate for now.
        // Wait, we need a way to GET the student data.

        async function fetchInvoice() {
            try {
                const res = await fetch(`/api/invoice/${params.id}`);
                if (res.ok) {
                    const student = await res.json();

                    // Logic to build comma separated course list from multiple arrays
                    let courseDetails = student.musicType || 'Music Course';
                    const specificItems = [];
                    if (student.instruments && student.instruments.length > 0) specificItems.push(...student.instruments);
                    if (student.vocalStyle) specificItems.push(student.vocalStyle);
                    if (student.danceStyles && student.danceStyles.length > 0) specificItems.push(...student.danceStyles);

                    if (specificItems.length > 0) {
                        courseDetails += ` (${specificItems.join(', ')})`;
                    }

                    // Generate unique serial number
                    const generatedSerialNo = `SR-${params.id}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
                    setSerialNo(generatedSerialNo);
                    
                    setData({
                        fullName: student.fullName,
                        invoiceNumber: student.invoiceNumber,
                        formNo: student.formNo,
                        panCard: student.panCard,
                        aadharCard: student.aadharCard,
                        phone: student.phone,
                        diplomaAdmissionYear: student.diplomaAdmissionYear,
                        date: new Date(student.createdAt).toLocaleDateString(),
                        branch: student.branch,
                        course: courseDetails,
                        amount: student.amountPaid,
                        transactionId: student.transactionId
                    });
                } else {
                    alert('Invoice not found');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchInvoice();
    }, [params.id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Invoice...</div>;
    if (!data) return <div style={{ padding: '50px', textAlign: 'center' }}>Invoice not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '40px', background: 'white', color: 'black', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #800000', paddingBottom: '20px', marginBottom: '30px' }}>
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ color: '#800000', margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>Nad Dhyas Foundation</h1>
                    <p style={{ margin: '3px 0', fontSize: '14px', color: '#333' }}>At post Deravan</p>
                    <p style={{ margin: '3px 0', fontSize: '14px', color: '#333' }}>taluka pattan Zilla Satara</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ color: '#800000', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Donation Receipt</h2>
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}><strong>Serial No:</strong> {serialNo}</p>
                </div>
            </div>

            {/* Invoice Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <p style={{ margin: '5px 0' }}><strong>Date:</strong> {data.date}</p>
                    <p style={{ margin: '5px 0' }}><strong>Invoice No:</strong> {data.formNo || data.invoiceNumber}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '5px 0' }}><strong>Branch:</strong> {data.branch}</p>
                </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>Bill To:</h3>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>{data.fullName}</p>
                <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <p style={{ margin: '5px 0' }}><strong>PAN Card:</strong> {data.panCard || 'N/A'}</p>
                    <p style={{ margin: '5px 0' }}><strong>Aadhar Card:</strong> {data.aadharCard || 'N/A'}</p>
                    <p style={{ margin: '5px 0' }}><strong>Mobile No:</strong> {data.phone || 'N/A'}</p>
                    <p style={{ margin: '5px 0' }}><strong>Diploma Year:</strong> {data.diplomaAdmissionYear || 'N/A'}</p>
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>
                            <div><strong>Admission Fees</strong></div>
                            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Course: {data.course}</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>Transaction ID: {data.transactionId}</div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{data.amount.toLocaleString()}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        <td style={{ padding: '15px 12px', textAlign: 'right' }}>Total Paid:</td>
                        <td style={{ padding: '15px 12px', textAlign: 'right', color: '#800000' }}>₹{data.amount.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#777', fontSize: '12px' }}>
                <p>Thank you for joining Swargumphan!</p>
                <p>This is a computer generated invoice and does not require a signature.</p>
            </div>

            {/* Print Button */}
            <div className="no-print" style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => window.print()}
                    style={{
                        padding: '12px 24px',
                        background: '#800000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Print / Download Invoice
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}
