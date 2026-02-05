import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Layers, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

const Analytics = ({ data, activities, theme }) => {
    if (!data) return null;

    const exportToPDF = () => {
        try {
            console.log("Generating PDF...");
            const doc = new jsPDF();
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            // Header
            doc.setFontSize(20);
            doc.setTextColor(99, 102, 241);
            doc.text('DeepFocus Productivity Report', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`User: ${userData.name || 'Anonymous User'}`, 14, 32);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
            doc.text(`Weekly Velocity: ${data.trends.trendPercent}%`, 14, 44);

            // Table
            const tableColumn = ["Date", "Objective", "Category", "Planned (h)", "Actual (h)"];
            const tableRows = activities.map(act => [
                act.date,
                act.title,
                act.category,
                act.expectedTime,
                act.actualTime
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                theme: 'grid',
                headStyles: { fillColor: [99, 102, 241] },
                margin: { top: 55 }
            });

            doc.save(`DeepFocus_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            console.log("PDF Saved.");
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Error generating PDF. Please check console.");
        }
    };

    const isDark = theme === 'dark';
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipColor = isDark ? '#fff' : '#0f172a';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    const exportToCSV = () => {
        try {
            const headers = ["Title,Category,Expected(h),Actual(h),Date"];
            const rows = activities.map(act =>
                `${act.title},${act.category},${act.expectedTime},${act.actualTime},${act.date}`
            );
            const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "productivity_report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("CSV Export Error:", error);
        }
    };

    const trendColor = parseFloat(data.trends.trendPercent) >= 0 ? 'var(--success)' : 'var(--danger)';
    const TrendIcon = parseFloat(data.trends.trendPercent) >= 0 ? TrendingUp : TrendingDown;

    return (
        <div className="analytics-section" style={{ marginTop: '3rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Deep Insights</h2>
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 100 }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); exportToCSV(); }}
                        className="glass-effect"
                        style={{
                            padding: '0.75rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            border: '1px solid var(--card-border)',
                            background: 'var(--glass)',
                            transition: 'all 0.2s',
                            zIndex: 101,
                            pointerEvents: 'auto'
                        }}
                    >
                        <Download size={18} /> CSV
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); exportToPDF(); }}
                        className="glass-effect"
                        style={{
                            padding: '0.75rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            border: '1px solid var(--card-border)',
                            background: 'var(--glass)',
                            transition: 'all 0.2s',
                            zIndex: 101,
                            pointerEvents: 'auto'
                        }}
                    >
                        <FileText size={18} /> PDF
                    </button>
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Trend Card */}
                <div className="glass-effect stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="stat-label">Weekly Velocity</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <div className="stat-value" style={{ color: trendColor }}>
                            {data.trends.trendPercent}%
                        </div>
                        <TrendIcon size={24} style={{ color: trendColor }} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        {data.trends.currentWeek}h this week vs {data.trends.previousWeek}h last week
                    </p>
                </div>

                {/* Category Distribution Chart */}
                <div className="glass-effect stat-card" style={{ height: '300px', padding: '1rem' }}>
                    <div className="stat-label" style={{ marginBottom: '1rem' }}>Focus Distribution</div>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie
                                data={data.distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="_id"
                            >
                                {data.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: tooltipColor,
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}
                                itemStyle={{ color: tooltipColor }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Heatmap Placeholder Effect (Using Bar Chart to simulate intensity) */}
                <div className="glass-effect stat-card" style={{ height: '300px', padding: '1rem' }}>
                    <div className="stat-label" style={{ marginBottom: '1rem' }}>Intensity Timeline</div>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={data.heatmap.slice(-14)}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="_id" hide />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: gridColor }}
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    color: tooltipColor
                                }}
                                itemStyle={{ color: tooltipColor }}
                            />
                            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
