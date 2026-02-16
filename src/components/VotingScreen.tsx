import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const VotingScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isConfirmed, setIsConfirmed] = useState(false);

    const alivePlayers = state.players.filter(p => p.isAlive);
    const currentVoter = alivePlayers[state.votingIndex];

    if (!currentVoter && state.useDigitalVoting) return null; // Only return null if digital voting is on and no current voter

    const handleCastVote = (targetId: string) => {
        if (state.useDigitalVoting) {
            dispatch({
                type: 'SUBMIT_DIGITAL_VOTE',
                payload: { voterId: currentVoter?.id || '', targetId }
            });
            setIsConfirmed(false);
        } else {
            dispatch({
                type: 'VOTE_PLAYER',
                payload: targetId
            });
        }
    };

    const isManual = !state.useDigitalVoting;

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            {(!isConfirmed && !isManual) ? (
                <div className="pass-device-container">
                    <h2 style={{ color: 'var(--neon-blue)', marginBottom: '2rem' }}>VOTACIÓN SECRETA</h2>
                    <div style={{ padding: '2rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '16px', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pasa el dispositivo a:</p>
                        <h1 style={{ fontSize: '3rem', margin: 0, color: '#fff' }}>{currentVoter?.name}</h1>
                    </div>
                    <Button onClick={() => setIsConfirmed(true)}>
                        SOY {currentVoter?.name.toUpperCase()}
                    </Button>
                </div>
            ) : (
                <div className="voting-interaction-container">
                    <h2 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>{isManual ? '¿QUIÉN ES EL IMPOSTOR?' : '¿Quién es el impostor?'}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        {isManual ? 'Lleguen a un acuerdo y seleccionen al sospechoso.' : 'Selecciona a alguien para votar. Tu voto es secreto.'}
                    </p>

                    <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                        {alivePlayers
                            .filter(p => isManual || p.id !== currentVoter?.id)
                            .map(player => (
                                <Button
                                    key={player.id}
                                    variant="secondary"
                                    onClick={() => handleCastVote(player.id)}
                                    style={{ padding: '1rem', height: 'auto', marginBottom: 0 }}
                                >
                                    {player.name}
                                </Button>
                            ))}
                    </div>

                    {!isManual && (
                        <div style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.8rem' }}>
                            Votando: {state.votingIndex + 1} / {alivePlayers.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
