import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const ResultsScreen: React.FC = () => {
    const { state, dispatch } = useGame();

    // Determine winner based on active players in state
    // If we are here, it means GameContext decided the game is over.
    // We re-derive who won for display purposes.

    const jesterWon = state.winnerRole === 'jester' || state.lastVotedPlayer?.role === 'jester';
    const citizensWin = state.winnerRole === 'citizen';
    const spyWon = state.winnerRole === 'spy';

    const allImpostors = state.players.filter(p => p.role === 'impostor');
    const allSpies = state.players.filter(p => p.role === 'spy');
    const allJesters = state.players.filter(p => p.role === 'jester');

    let titleColor = 'var(--neon-red)';
    let titleText = '¡IMPOSTORES GANAN!';
    let subtitleText = '¡Los impostores han tomado el control!';

    if (jesterWon) {
        titleColor = 'var(--neon-purple)';
        titleText = '¡EL BUFÓN GANA!';
        subtitleText = `¡${state.lastVotedPlayer?.name} ha engañado a todos para ser votado!`;
    } else if (citizensWin) {
        titleColor = 'var(--neon-green)';
        titleText = '¡CIUDADANOS GANAN!';
        subtitleText = '¡Todos los impostores han sido eliminados!';
    } else if (spyWon) {
        titleColor = 'var(--neon-red)';
        titleText = '¡IMPOSTORES GANAN!';
        subtitleText = '¡GRACIAS AL ESPÍA POR ADIVINAR LA PALABRA!';
    }

    return (
        <div className="glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
            <h1 style={{
                color: titleColor,
                textShadow: `0 0 20px ${titleColor}`,
                fontSize: '3rem',
                marginBottom: '1rem',
                position: 'relative',
                zIndex: 2
            }}>
                {titleText}
            </h1>

            <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    {subtitleText}
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
                ) : jesterWon ? (
                    <>
                        <img
                            src={`${import.meta.env.BASE_URL}caja-bufon.png`}
                            alt="Caja Bufón"
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
                            src={`${import.meta.env.BASE_URL}bufon.png`}
                            alt="Bufón"
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
                ) : spyWon ? (
                    <>
                        <img
                            src={`${import.meta.env.BASE_URL}pizarra-espia.png`}
                            alt="Pizarra Espía"
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
                            src={`${import.meta.env.BASE_URL}espia.png`}
                            alt="Espía"
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
                <p style={{ marginBottom: '0.1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Palabra Secreta:</p>
                <p style={{ fontSize: '1.5rem', marginTop: '0', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}><strong>{state.secretWord}</strong></p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Impostores:</p>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                            {allImpostors.map(imp => (
                                <li key={imp.id} style={{ color: 'var(--neon-red)', fontWeight: 'bold' }}>{imp.name}</li>
                            ))}
                        </ul>
                    </div>
                    {allSpies.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Espías:</p>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                                {allSpies.map(spy => (
                                    <li key={spy.id} style={{ color: '#ffaa00', fontWeight: 'bold' }}>{spy.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {allJesters.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Bufones:</p>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                                {allJesters.map(jest => (
                                    <li key={jest.id} style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>{jest.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <Button onClick={() => dispatch({ type: 'RESET_GAME' })} style={{ position: 'relative', zIndex: 2 }}>
                JUGAR DE NUEVO
            </Button>
        </div>
    );
};
