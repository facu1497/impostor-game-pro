import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const ResultsScreen: React.FC = () => {
    const { state, dispatch } = useGame();

    // Determine winner based on active players in state
    // If we are here, it means GameContext decided the game is over.
    // We re-derive who won for display purposes.

    const activeImpostors = state.players.filter(p => p.isAlive && p.role === 'impostor');
    // If no impostors left -> Citizens Won
    // If impostors >= citizens -> Impostors Won (technically context handles this transition)

    const citizensWin = activeImpostors.length === 0;

    const allImpostors = state.players.filter(p => p.role === 'impostor');

    return (
        <div className="glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
            <h1 style={{
                color: citizensWin ? 'var(--neon-green)' : 'var(--neon-red)',
                textShadow: citizensWin ? '0 0 20px var(--neon-green)' : '0 0 20px var(--neon-red)',
                fontSize: '3rem',
                marginBottom: '1rem',
                position: 'relative',
                zIndex: 2
            }}>
                {citizensWin ? '¡CIUDADANOS GANAN!' : '¡IMPOSTORES GANAN!'}
            </h1>

            <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    {citizensWin
                        ? "¡Todos los impostores han sido eliminados!"
                        : "¡Los impostores han tomado el control!"}
                </p>
            </div>

            <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '16px',
                marginBottom: '2rem',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 2
            }}>
                {citizensWin ? (
                    <>
                        <img
                            src={`${import.meta.env.BASE_URL}police-car.png`}
                            alt="Police Car"
                            style={{
                                position: 'absolute',
                                left: '0px',
                                bottom: '0px',
                                width: '120px',
                                zIndex: 3,
                                filter: 'drop-shadow(0 0 10px rgba(94, 94, 99, 0.12))'
                            }}
                        />
                        <img
                            src={`${import.meta.env.BASE_URL}police-officer.png`}
                            alt="Police Officer"
                            style={{
                                position: 'absolute',
                                right: '0px',
                                bottom: '10px',
                                height: '180px',
                                zIndex: 3,
                                filter: 'drop-shadow(0 0 10px rgba(94, 94, 99, 0.12))'
                            }}
                        />
                    </>
                ) : (
                    <>
                        <img
                            src={`${import.meta.env.BASE_URL}money-bag.png`}
                            alt="Money Bag"
                            style={{
                                position: 'absolute',
                                left: '0px',
                                bottom: '0px',
                                width: '120px',
                                zIndex: 3,
                                filter: 'drop-shadow(0 0 10px rgba(94, 94, 99, 0.12))'
                            }}
                        />
                        <img
                            src={`${import.meta.env.BASE_URL}mafioso.png`}
                            alt="Mafioso"
                            style={{
                                position: 'absolute',
                                right: '0px',
                                bottom: '10px',
                                height: '180px',
                                zIndex: 3,
                                filter: 'drop-shadow(0 0 10px rgba(94, 94, 99, 0.12))'
                            }}
                        />
                    </>
                )}

                <h3 style={{ color: 'var(--neon-blue)' }}>REVELACIONES</h3>
                <p style={{ marginBottom: '0.5rem' }}>Palabra Secreta:</p>
                <p style={{ fontSize: '1.5rem', marginTop: '0' }}><strong>{state.secretWord}</strong></p>
                <div style={{ marginTop: '1rem' }}>
                    <p>Impostores:</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {allImpostors.map(imp => (
                            <li key={imp.id} style={{ color: 'var(--neon-red)', fontWeight: 'bold' }}>
                                {imp.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Button onClick={() => dispatch({ type: 'RESET_GAME' })} style={{ position: 'relative', zIndex: 2 }}>
                JUGAR DE NUEVO
            </Button>
        </div>
    );
};
