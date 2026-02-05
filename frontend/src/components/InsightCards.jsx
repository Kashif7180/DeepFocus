import React from 'react';

const InsightCards = ({ insights, loading }) => {
    if (loading) return <div>Calculating insights...</div>;
    if (!insights || !insights.totals) return null;

    return (
        <div className="stats-grid">
            <div className="glass-effect stat-card">
                <div className="stat-label">Productive Vol.</div>
                <div className="stat-value">{insights.totals.totalActual}h</div>
            </div>

            <div className="glass-effect stat-card">
                <div className="stat-label">Efficiency</div>
                <div className="stat-value" style={{ color: 'var(--primary)' }}>
                    {insights.totals.efficiency}
                </div>
            </div>

            <div className="glass-effect stat-card">
                <div className="stat-label">Current Status</div>
                <div className={`stat-value ${insights.status === 'On-target' ? 'pulse-success' :
                        insights.status === 'Over-extended' ? 'pulse-warning' : 'pulse-danger'
                    }`}>
                    {insights.status}
                </div>
            </div>
        </div>
    );
};

export default InsightCards;
