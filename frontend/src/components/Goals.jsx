import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Plus, CheckCircle2 } from 'lucide-react';

const Goals = ({ insights }) => {
    const [goals, setGoals] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newGoal, setNewGoal] = useState({ category: 'DSA', targetHours: '' });

    const fetchGoals = async () => {
        try {
            const res = await api.get('/activities/goals');
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSetGoal = async (e) => {
        e.preventDefault();
        try {
            await api.post('/activities/goals', newGoal);
            setIsAdding(false);
            fetchGoals();
        } catch (err) {
            alert("Error setting goal");
        }
    };

    const getProgress = (category, target) => {
        const stats = insights?.categoryStats?.find(s => s._id === category);
        const actual = stats?.actual || 0;
        const percent = Math.min((actual / target) * 100, 100);
        return { actual, percent: percent.toFixed(0) };
    };

    return (
        <div className="goals-section" style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target className="pulse-warning" /> Weekly Missions
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="glass-effect"
                    style={{ padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', border: '1px solid var(--card-border)' }}
                >
                    {isAdding ? 'CANCEL' : <Plus size={20} />}
                </button>
            </div>

            {isAdding && (
                <form className="glass-effect" style={{ padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem' }} onSubmit={handleSetGoal}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label>CATEGORY</label>
                            <select
                                className="input-field"
                                style={{ marginBottom: 0 }}
                                value={newGoal.category}
                                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                            >
                                <option>DSA</option>
                                <option>Web Development</option>
                                <option>Project</option>
                                <option>Communication</option>
                                <option>Aptitude</option>
                                <option>Core Subjects</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>WEEKLY TARGET (HRS)</label>
                            <input
                                type="number"
                                className="input-field"
                                style={{ marginBottom: 0 }}
                                placeholder="10"
                                value={newGoal.targetHours}
                                onChange={(e) => setNewGoal({ ...newGoal, targetHours: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>SET</button>
                    </div>
                </form>
            )}

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {goals.length === 0 && !isAdding && (
                    <div className="glass-effect" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
                        No active missions. Set your first goal to start tracking!
                    </div>
                )}
                {goals.map(goal => {
                    const { actual, percent } = getProgress(goal.category, goal.targetHours);
                    return (
                        <div key={goal._id} className="glass-effect stat-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: '700', fontSize: '1rem' }}>{goal.category}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{actual}h / {goal.targetHours}h</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--glass)', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                <div style={{
                                    width: `${percent}%`,
                                    height: '100%',
                                    background: percent >= 100 ? 'var(--success)' : 'var(--primary)',
                                    transition: 'width 1s ease-in-out'
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: percent >= 100 ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {percent}% COMPLETE
                                </span>
                                {percent >= 100 && <CheckCircle2 size={16} className="pulse-success" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;
