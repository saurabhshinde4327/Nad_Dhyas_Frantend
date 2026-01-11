'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SideNav from '../../dashboard/SideNav';
import { mockHeadDashboardStats } from '@/app/utils/mockData';

// Line Chart Component
const LineChart = ({ data, title, color }: { data: { label: string, value: number }[], title: string, color: string }) => {
    const maxValue = Math.max(...data.map(d => d.value)) * 1.2 || 100; // Add 20% headroom

    // Create points string
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');

    // Create area path (points + bottom corners)
    const areaPoints = `${points} 100,100 0,100`;

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            marginTop: '20px',
            transition: 'all 0.3s ease'
        }}>
            <h3 style={{ marginBottom: '32px', color: '#111827', fontSize: '1.5rem', fontWeight: '700' }}>{title}</h3>

            <div style={{ height: '350px', width: '100%', position: 'relative', padding: '10px 20px 30px' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines (Dashed) */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <g key={y}>
                            <line x1="0" y1={y} x2="100" y2={y} stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="2" />
                            <text x="-2" y={y + 1} fontSize="3" textAnchor="end" fill="#9ca3af" style={{ userSelect: 'none' }}>
                                {Math.round(maxValue * (1 - y / 100) / 1000)}k
                            </text>
                        </g>
                    ))}

                    {/* Area Fill */}
                    <polygon
                        points={areaPoints}
                        fill={`url(#gradient-${color})`}
                    />

                    {/* The Line */}
                    <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                        style={{ filter: `drop-shadow(0 4px 3px ${color}40)` }}
                    />

                    {/* Data Points */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (d.value / maxValue) * 100;
                        return (
                            <g key={i} className="group">
                                {/* Invisible larger hit area for hover if we had CSS hover, here just visual */}
                                <circle cx={x} cy={y} r="1.5" fill="white" stroke={color} strokeWidth="1" />
                                <circle cx={x} cy={y} r="3" fill="transparent" /> {/* Spacer */}

                                {/* Value Label */}
                                <g transform={`translate(${x}, ${y - 6})`}>
                                    <rect x="-8" y="-4" width="16" height="5" rx="1" fill="#1f2937" opacity="0.9" />
                                    <text x="0" y="0" fontSize="2.5" textAnchor="middle" fill="white" alignmentBaseline="middle" fontWeight="bold">
                                        ₹{d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>

                {/* X-Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingLeft: '0', paddingRight: '0' }}>
                    {data.map((d, i) => (
                        <span key={i} style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontWeight: '500',
                            width: `${100 / data.length}%`,
                            textAlign: 'center'
                        }}>
                            {d.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Salary Table Component
const SalaryTable = ({ role }: { role: string }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Generate mock salary data
    const salaryData = months.map(month => ({
        month,
        amount: role === 'head' ? 45000 : 15000,
        status: Math.random() > 0.2 ? 'Paid' : 'Unpaid'
    }));

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginTop: '20px'
        }}>
            <h3 style={{ marginBottom: '24px', color: '#374151', fontSize: '1.25rem' }}>Salary Payment Status ({new Date().getFullYear()})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '12px', color: '#4b5563' }}>Month</th>
                            <th style={{ padding: '12px', color: '#4b5563' }}>Amount</th>
                            <th style={{ padding: '12px', color: '#4b5563' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaryData.map((row, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px', color: '#111827' }}>{row.month}</td>
                                <td style={{ padding: '12px', color: '#111827' }}>₹{row.amount.toLocaleString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        backgroundColor: row.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                                        color: row.status === 'Paid' ? '#166534' : '#991b1b'
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function ExpensePage() {
    const params = useParams();
    const router = useRouter();
    const [role, setRole] = useState<'head' | 'branch' | null>(null);
    const [branchId, setBranchId] = useState<string>('');
    const type = params.type as string;

    useEffect(() => {
        const checkRole = () => {
            if (localStorage.getItem('isHeadAdminLoggedIn') === 'true') {
                setRole('head');
            } else if (localStorage.getItem('isBranchAdmin') === 'true') {
                setRole('branch');
                const id = localStorage.getItem('loggedInBranchId');
                if (id) setBranchId(id);
            } else {
                router.push('/admin/login');
            }
        };
        checkRole();
    }, [router]);

    const getTitle = (t: string) => {
        switch (t) {
            case 'shop-rent': return 'Shop Rent';
            case 'electricity': return 'Electricity Bill';
            case 'instruments': return 'Instruments';
            case 'teachers-salary': return 'Teachers Salary';
            case 'incharge-salary': return 'Branch Incharge Salary';
            default: return 'Expense';
        }
    };

    // Generate Mock Data for Visualization
    const getChartData = () => {
        if (role === 'branch') {
            // Branch View: Monthly Trends
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.map(m => ({
                label: m,
                value: Math.floor(Math.random() * 5000) + 1000 // Simulate varying expenses
            }));
        } else {
            // Head Admin View: Comparison by Branch
            return mockHeadDashboardStats.map(b => ({
                label: b.name.replace(' Branch Incharge', ''), // Shorten name
                value: Math.floor(Math.random() * 15000) + 5000 // Simulate random totals per branch
            }));
        }
    };

    if (!role) return null;

    // Determine what to render based on type
    const isSalaryPage = type === 'teachers-salary' || type === 'incharge-salary';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <SideNav />
            <div style={{
                marginLeft: '0px',
                padding: '40px',
                paddingTop: '100px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#111827', fontWeight: '800' }}>
                        {getTitle(type)} Analysis
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '10px' }}>
                        {role === 'head' ? 'Comparison across all branches' : 'Monthly details for your branch'}
                    </p>
                </header>

                <main>
                    {isSalaryPage ? (
                        <SalaryTable role={role} />
                    ) : (
                        <LineChart
                            title={`Analytics for ${getTitle(type)}`}
                            data={getChartData()}
                            color={role === 'head' ? '#8b5cf6' : '#3b82f6'}
                        />
                    )}

                    {/* Placeholder Table for non-salary pages if needed, or keeping it clean */}
                    {!isSalaryPage && (
                        <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Details Log</h3>
                            <p style={{ color: '#6b7280' }}>Detailed transaction logs for {getTitle(type)} will appear here.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
