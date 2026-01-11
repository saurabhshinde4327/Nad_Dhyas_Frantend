'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BranchFeeData {
    branch: string
    total_fees: number
    count: number
}

interface BranchFeesChartProps {
    data: BranchFeeData[]
}

export default function BranchFeesChart({ data }: BranchFeesChartProps) {
    // Format data for the chart
    const chartData = data.map((item) => ({
        branch: item.branch,
        'Total Fees (₹)': item.total_fees,
        'Student Count': item.count,
    }))

    // Custom tooltip to show formatted currency
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ fontWeight: '600', marginBottom: '8px' }}>{payload[0].payload.branch}</p>
                    <p style={{ color: '#10b981', margin: '4px 0' }}>
                        Total Fees: <strong>₹{payload[0].value.toLocaleString('en-IN')}</strong>
                    </p>
                    <p style={{ color: '#3b82f6', margin: '4px 0' }}>
                        Students: <strong>{payload[1].value}</strong>
                    </p>
                </div>
            )
        }
        return null
    }

    // Custom Y-axis formatter for currency
    const formatCurrency = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`
        } else if (value >= 1000) {
            return `₹${(value / 1000).toFixed(0)}K`
        }
        return `₹${value}`
    }

    return (
        <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="branch" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                        yAxisId="left"
                        tick={{ fill: '#6b7280' }}
                        style={{ fontSize: '12px' }}
                        tickFormatter={formatCurrency}
                    />
                    <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: '#6b7280' }}
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Bar 
                        yAxisId="left"
                        dataKey="Total Fees (₹)" 
                        fill="#10b981" 
                        radius={[8, 8, 0, 0]}
                        name="Total Fees"
                    />
                    <Bar 
                        yAxisId="right"
                        dataKey="Student Count" 
                        fill="#3b82f6" 
                        radius={[8, 8, 0, 0]}
                        name="Student Count"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
