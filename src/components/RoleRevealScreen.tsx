import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const RoleRevealScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isRevealed, setIsRevealed] = useState(false);
    const currentPlayer = state.players[state.revealIndex];

    const handleNext = () => {
        setIsRevealed(false);
        dispatch({ type: 'NEXT_REVEAL' });
    };

    if (!currentPlayer) return <div>Error: No player found</div>;

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>TURNO DE</h2>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--neon-blue)', marginBottom: '2rem' }}>
                {currentPlayer.name}
            </h1>

            {!isRevealed ? (
                <>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Pasa el dispositivo a {currentPlayer.name}. <br />
                        Asegúrate de que nadie más esté mirando.
                    </p>
                    <Button onClick={() => setIsRevealed(true)} style={{ fontSize: '1.5rem', padding: '1.5rem' }}>
                        VER MI ROL
                    </Button>
                </>
            ) : (
                <div style={{ animation: 'fadeIn 0.5s' }}>
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
    );
};
