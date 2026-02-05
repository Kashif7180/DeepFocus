import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Bell } from 'lucide-react';

const Pomodoro = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // focus or break

    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    // Timer finished
                    clearInterval(timerRef.current);
                    setIsActive(false);
                    playAlarm();
                    handleComplete();
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, seconds, minutes]);

    const playAlarm = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
    };

    const handleComplete = () => {
        if (mode === 'focus') {
            alert("Deep Session Complete! Time to take a break.");
        } else {
            alert("Break finished! Ready to focus?");
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(mode === 'focus' ? 25 : 5);
        setSeconds(0);
    };

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setMinutes(newMode === 'focus' ? 25 : 5);
        setSeconds(0);
    };

    return (
        <div className="glass-effect pomodoro-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => switchMode('focus')}
                    className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
                    style={{
                        padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: mode === 'focus' ? 'var(--primary)' : 'var(--glass)',
                        color: mode === 'focus' ? 'white' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Brain size={18} /> FOCUS
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
                    style={{
                        padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: mode === 'break' ? 'var(--accent)' : 'var(--glass)',
                        color: mode === 'break' ? 'white' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Coffee size={18} /> BREAK
                </button>
            </div>

            <div style={{ fontSize: '4rem', fontWeight: '800', fontFamily: 'monospace', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <button
                    onClick={toggleTimer}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%', border: 'none',
                        background: 'var(--primary)', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                    }}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
                </button>
                <button
                    onClick={resetTimer}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%', border: 'none',
                        background: 'var(--glass)', color: 'var(--text-primary)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--card-border)'
                    }}
                >
                    <RotateCcw size={24} />
                </button>
            </div>

            {mode === 'focus' && !isActive && minutes === 0 && seconds === 0 && (
                <p style={{ marginTop: '1.5rem', color: 'var(--success)', fontWeight: '600' }}>
                    🚀 Mission Accomplished! Log this activity above.
                </p>
            )}
        </div>
    );
};

export default Pomodoro;
