import React, { useRef, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const DrawingBoard: React.FC = () => {
    const { state, dispatch } = useGame();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const alivePlayers = state.players.filter(p => p.isAlive);
    const currentDrawer = alivePlayers[state.drawingIndex];

    const [isSpyGuessing, setIsSpyGuessing] = useState(false);
    const [spyWordGuess, setSpyWordGuess] = useState('');

    const handleSpyGuess = () => {
        if (!spyWordGuess.trim()) return;
        dispatch({ type: 'SPY_GUESS', payload: spyWordGuess });
    };

    const hasSpy = state.selectedRoles.includes('spy');

    useEffect(() => {
        if (isConfirmed && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleDone();
        }
    }, [isConfirmed, timeLeft]);

    useEffect(() => {
        if (isConfirmed && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
            }
        }
    }, [isConfirmed]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.beginPath();
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleDone = () => {
        dispatch({ type: 'SUBMIT_DRAWING' });
        setIsConfirmed(false);
        setTimeLeft(20);
    };

    if (!currentDrawer) return null;

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            {!isConfirmed ? (
                <div className="pass-device-container">
                    <h2 style={{ color: 'var(--neon-blue)', marginBottom: '2rem' }}>DIBUJA TU PISTA 🎨</h2>
                    <div style={{ padding: '2rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '16px', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pasa el dispositivo a:</p>
                        <h1 style={{ fontSize: '3rem', margin: 0, color: '#fff' }}>{currentDrawer.name}</h1>
                    </div>
                    <Button onClick={() => setIsConfirmed(true)}>
                        SOY {currentDrawer.name.toUpperCase()}
                    </Button>
                </div>
            ) : (
                <div className="drawing-interaction-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ color: 'var(--neon-blue)', margin: 0 }}>DIBUJA</h2>
                        <div style={{
                            fontSize: '1.5rem',
                            color: timeLeft < 5 ? 'var(--neon-red)' : '#fff',
                            fontWeight: 'bold',
                            padding: '0.2rem 0.8rem',
                            border: `2px solid ${timeLeft < 5 ? 'var(--neon-red)' : 'var(--neon-blue)'}`,
                            borderRadius: '8px'
                        }}>
                            {timeLeft}s
                        </div>
                    </div>

                    {!isSpyGuessing ? (
                        <>
                            <canvas
                                ref={canvasRef}
                                width={300}
                                height={400}
                                style={{
                                    background: '#000',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    cursor: 'crosshair',
                                    touchAction: 'none',
                                    width: '100%',
                                    maxWidth: '350px'
                                }}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseOut={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />

                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <Button onClick={handleDone}>¡LISTO!</Button>

                                {hasSpy && (
                                    <Button
                                        onClick={() => setIsSpyGuessing(true)}
                                        style={{
                                            background: 'linear-gradient(45deg, #ffaa00, #ff5500)',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            boxShadow: '0 0 15px rgba(255, 170, 0, 0.5)'
                                        }}
                                    >
                                        🎭 ¡SOY EL ESPÍA!
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '2rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', marginTop: '2rem' }}>
                            <h3 style={{ color: '#ffaa00', marginBottom: '1rem' }}>REVELAR IDENTIDAD</h3>
                            <input
                                type="text"
                                placeholder="Escribe la palabra secreta..."
                                value={spyWordGuess}
                                onChange={(e) => setSpyWordGuess(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ffaa00',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: '#fff',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button onClick={handleSpyGuess} style={{ background: '#ffaa00', color: '#000' }}>ADIVINAR</Button>
                                <Button variant="secondary" onClick={() => setIsSpyGuessing(false)}>CANCELAR</Button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', opacity: 0.5, fontSize: '0.8rem' }}>
                        Turno: {state.drawingIndex + 1} / {alivePlayers.length}
                    </div>
                </div>
            )}
        </div>
    );
};
