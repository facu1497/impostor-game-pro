import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const RoleRevealScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const scanTimeoutRef = useRef<any>(null);
    const progressIntervalRef = useRef<any>(null);

    const currentPlayer = state.players[state.revealIndex];

    const handleNext = () => {
        setIsRevealed(false);
        setScanProgress(0);
        dispatch({ type: 'NEXT_REVEAL' });
    };

    const startScan = () => {
        setIsScanning(true);
        setScanProgress(0);

        // Progress animation logic
        progressIntervalRef.current = setInterval(() => {
            setScanProgress(prev => Math.min(prev + 10, 100)); // 10% every 100ms = 1s
        }, 100);

        scanTimeoutRef.current = setTimeout(() => {
            setIsRevealed(true);
            setIsScanning(false);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        }, 1000); // 1 second to reveal
    };

    const cancelScan = () => {
        setIsScanning(false);
        setIsRevealed(false);
        setScanProgress(0);
        if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    useEffect(() => {
        return () => {
            if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    if (!currentPlayer) return <div>Error: No player found</div>;

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>TURNO DE</h2>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--neon-blue)', marginBottom: '2rem' }}>
                {currentPlayer.name}
            </h1>

            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {!isRevealed ? (
                    <div className="scanner-container">
                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Pasa el dispositivo a {currentPlayer.name}. <br />
                            Asegúrate de que nadie más esté mirando.
                        </p>

                        <div
                            className={`fingerprint-area ${isScanning ? 'scanning' : ''}`}
                            onMouseDown={startScan}
                            onMouseUp={cancelScan}
                            onMouseLeave={cancelScan}
                            onTouchStart={(e) => { e.preventDefault(); startScan(); }}
                            onTouchEnd={cancelScan}
                        >
                            <div className="scanning-laser"></div>
                            <img
                                src={`${import.meta.env.BASE_URL}fingerprint.png`}
                                alt="Fingerprint"
                                className="fingerprint-image"
                                draggable="false"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                        <p className="scan-label">
                            {isScanning ? `Escaneando... ${scanProgress}%` : 'MANTÉN PARA ESCANEAR'}
                        </p>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn 0.3s', width: '100%' }} onTouchStart={(e) => e.stopPropagation()} onMouseLeave={cancelScan}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Tu rol es:</p>

                        {currentPlayer.role === 'impostor' ? (
                            <div style={{
                                border: '2px solid var(--neon-red)',
                                padding: '2rem',
                                borderRadius: '16px',
                                boxShadow: '0 0 20px var(--neon-red), inset 0 0 20px var(--neon-red)',
                                marginBottom: '2rem',
                                color: 'var(--neon-red)'
                            }}>
                                <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 10px var(--neon-red)' }}>IMPOSTOR</h1>
                                {state.impostorKnowsCategory && state.realCategoryName && (
                                    <p style={{ fontSize: '1.2rem', color: '#fff', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                                        Categoría: <strong>{state.realCategoryName}</strong>
                                    </p>
                                )}
                                <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Engaña a los demás.</p>
                            </div>
                        ) : currentPlayer.role === 'spy' ? (
                            <div style={{
                                border: '2px solid #ffaa00',
                                padding: '2rem',
                                borderRadius: '16px',
                                boxShadow: '0 0 20px #ffaa00, inset 0 0 20px #ffaa00',
                                marginBottom: '2rem',
                                color: '#ffaa00'
                            }}>
                                <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 10px #ffaa00' }}>ESPÍA</h1>
                                <p style={{ fontSize: '1.2rem', color: '#fff', marginTop: '1rem' }}>
                                    Categoría: <strong>{state.realCategoryName}</strong>
                                </p>
                                <p style={{ fontSize: '1.2rem', color: '#fff', marginTop: '0.5rem', marginBottom: '1rem' }}>
                                    Primera Letra: <strong style={{ fontSize: '2rem', color: '#ffaa00' }}>{state.secretWord.charAt(0).toUpperCase()}</strong>
                                </p>
                                <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Averigua la palabra secreta.</p>
                            </div>
                        ) : currentPlayer.role === 'jester' ? (
                            <div style={{
                                border: '2px solid var(--neon-purple)',
                                padding: '2rem',
                                borderRadius: '16px',
                                boxShadow: '0 0 20px var(--neon-purple), inset 0 0 20px var(--neon-purple)',
                                marginBottom: '2rem',
                                color: 'var(--neon-purple)'
                            }}>
                                <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 10px var(--neon-purple)' }}>BUFÓN</h1>
                                <p style={{ fontSize: '1.2rem', color: '#fff', marginTop: '1rem' }}>
                                    Tu objetivo: <strong>Ser votado</strong>.
                                </p>
                                <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Si te eligen para ser eliminado, ¡ganas tú solo!</p>
                            </div>
                        ) : (
                            <div style={{
                                border: '2px solid var(--neon-green)',
                                padding: '2rem',
                                borderRadius: '16px',
                                boxShadow: '0 0 20px var(--neon-green), inset 0 0 20px var(--neon-green)',
                                marginBottom: '2rem',
                                color: 'var(--neon-green)'
                            }}>
                                <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 10px var(--neon-green)' }}>CIUDADANO</h1>
                                <p style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#fff' }}>Palabra: <strong>{state.secretWord}</strong></p>
                            </div>
                        )}

                        <Button variant="secondary" onClick={handleNext}>
                            {state.revealIndex < state.players.length - 1 ? 'SIGUIENTE JUGADOR' : 'COMENZAR RONDA'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
