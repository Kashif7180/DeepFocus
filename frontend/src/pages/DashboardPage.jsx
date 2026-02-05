import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ActivityForm from '../components/ActivityForm';
import InsightCards from '../components/InsightCards';
import Analytics from './AnalyticsPage';
import Pomodoro from '../components/Pomodoro';
import Goals from '../components/Goals';
import { Trash2, Search, Filter } from 'lucide-react';

const Dashboard = () => {
    const [activities, setActivities] = useState([]);
    const [insights, setInsights] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const theme = localStorage.getItem('theme') || 'dark';

    const fetchData = async () => {
        try {
            setLoading(true);
            const [activitiesRes, insightsRes, analyticsRes] = await Promise.all([
                api.get('/activities'),
                api.get('/activities/insights'),
                api.get('/activities/analytics')
            ]);
            setActivities(activitiesRes.data);
            setInsights(insightsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this activity?")) return;

        try {
            await api.delete(`/activities/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting activity:", error);
            alert("Failed to delete activity.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredActivities = activities.filter(act => {
        const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === 'All' || act.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container">
            <header>
                <h1>DeepFocus</h1>
                <p>Master your time by measuring what matters.</p>
            </header>

            <InsightCards insights={insights} loading={loading} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', marginBottom: '3rem' }}>
                <Goals insights={insights} />
                <Pomodoro />
            </div>

            <div className="dashboard-grid">
                <div className="form-section">
                    <ActivityForm onActivityAdded={fetchData} />
                </div>

                <div className="list-section">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Activity Log</h2>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total: {filteredActivities.length}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="glass-effect" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
                                <input
                                    type="text"
                                    placeholder="Search objectives..."
                                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', padding: '0.75rem 0' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="glass-effect" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                <Filter size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
                                <select
                                    className="input-field"
                                    style={{ background: 'none', border: 'none', marginBottom: 0, padding: '0.75rem 0', width: 'auto', cursor: 'pointer' }}
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    <option>DSA</option>
                                    <option>Web Development</option>
                                    <option>Project</option>
                                    <option>Communication</option>
                                    <option>Aptitude</option>
                                    <option>Core Subjects</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="glass-effect" style={{ padding: '2rem', textAlign: 'center' }}>Analyzing pipeline...</div>
                    ) : (
                        <div className="activity-list" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {filteredActivities.length === 0 ? (
                                <div className="glass-effect" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {activities.length === 0 ? "No captures found in Atlas." : "No activities match your filters."}
                                </div>
                            ) : (
                                filteredActivities.map((activity, index) => (
                                    <div
                                        key={activity._id}
                                        className="glass-effect activity-card"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="activity-info">
                                            <h3>{activity.title}</h3>
                                            <span className="category-badge" data-cat={activity.category}>{activity.category}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div className="time-display">
                                                <div className="time-actual">{activity.actualTime}h</div>
                                                <div className="time-expected">Plan: {activity.expectedTime}h</div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(activity._id)}
                                                className="glass-effect"
                                                style={{
                                                    padding: '0.5rem',
                                                    color: 'var(--danger)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ).reverse()}
                        </div>
                    )}
                </div>
            </div>

            {!loading && analytics && <Analytics data={analytics} activities={activities} theme={theme} />}
        </div>
    );
};

export default Dashboard;
