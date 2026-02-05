import React, { useState } from 'react';
import api from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'DSA',
        expectedHrs: '',
        expectedMins: '',
        actualHrs: '',
        actualMins: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert Hrs/Mins to decimal hours
        const expectedTotal = parseFloat(formData.expectedHrs || 0) + (parseFloat(formData.expectedMins || 0) / 60);
        const actualTotal = parseFloat(formData.actualHrs || 0) + (parseFloat(formData.actualMins || 0) / 60);

        const apiData = {
            title: formData.title,
            category: formData.category,
            expectedTime: expectedTotal.toFixed(2),
            actualTime: actualTotal.toFixed(2),
            date: formData.date
        };

        try {
            await api.post('/activities', apiData);
            setFormData({
                ...formData,
                title: '',
                expectedHrs: '',
                expectedMins: '',
                actualHrs: '',
                actualMins: ''
            });
            onActivityAdded();
        } catch (error) {
            alert("Error adding activity. Check console.");
            console.error(error);
        }
    };

    return (
        <form className="glass-effect form-card" onSubmit={handleSubmit}>
            <div className="form-title">
                🚀 New Capture
            </div>

            <div className="form-group">
                <label>OBJECTIVE</label>
                <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Build Auth System"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label>CATEGORY</label>
                <select
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    <option value="DSA">DSA</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Project">Project</option>
                    <option value="Communication">Communication</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Core Subjects">Core Subjects</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                    <label>EXPECTED TIME</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Hrs"
                            value={formData.expectedHrs}
                            onChange={(e) => setFormData({ ...formData, expectedHrs: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Min"
                            max="59"
                            value={formData.expectedMins}
                            onChange={(e) => setFormData({ ...formData, expectedMins: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>ACTUAL TIME</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Hrs"
                            value={formData.actualHrs}
                            onChange={(e) => setFormData({ ...formData, actualHrs: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Min"
                            max="59"
                            value={formData.actualMins}
                            onChange={(e) => setFormData({ ...formData, actualMins: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>TIMELINE</label>
                <input
                    type="date"
                    className="input-field"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="btn-primary">SYNC TO ATLAS</button>
        </form>
    );
};

export default ActivityForm;
