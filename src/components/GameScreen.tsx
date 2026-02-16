import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const GameScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [timeLeft, setTimeLeft] = useState(state.roundDuration);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(seconds => seconds - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h2>RONDA EN PROGRESO</h2>

            <div style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                margin: '2rem 0',
                fontFamily: 'monospace',
                textShadow: '0 0 20px var(--neon-blue)'
            }}>
                {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <Button
                    variant="secondary"
                    onClick={() => setIsActive(!isActive)}
                    style={{ width: 'auto' }}
                >
                    {isActive ? 'PAUSAR' : 'REANUDAR'}
                </Button>
            </div>

            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <p><strong>Instrucciones:</strong></p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                    <li>Hagan una ronda de preguntas/afirmaciones.</li>
                    <li>Cada jugador dice una palabra relacionada sin ser demasiado obvio.</li>
                    <li>El Impostor debe intentar pasar desapercibido.</li>
                </ul>
            </div>

            <Button variant="danger" onClick={() => dispatch({ type: 'END_ROUND' })}>
                FINALIZAR Y VOTAR
            </Button>
        </div>
    );
};
