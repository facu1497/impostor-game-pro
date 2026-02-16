import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const VotingScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isConfirmed, setIsConfirmed] = useState(false);

    const alivePlayers = state.players.filter(p => p.isAlive);
    const currentVoter = alivePlayers[state.votingIndex];

    if (!currentVoter) return null;

    const handleCastVote = (targetId: string) => {
        dispatch({
            type: 'SUBMIT_DIGITAL_VOTE',
            payload: { voterId: currentVoter.id, targetId }
        });
        setIsConfirmed(false);
    };

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            {!isConfirmed ? (
                <div className="pass-device-container">
                    <h2 style={{ color: 'var(--neon-blue)', marginBottom: '2rem' }}>VOTACIÓN SECRETA</h2>
                    <div style={{ padding: '2rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '16px', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pasa el dispositivo a:</p>
                        <h1 style={{ fontSize: '3rem', margin: 0, color: '#fff' }}>{currentVoter.name}</h1>
                    </div>
                    <Button onClick={() => setIsConfirmed(true)}>
                        SOY {currentVoter.name.toUpperCase()}
                    </Button>
                </div>
            ) : (
                <div className="voting-interaction-container">
                    <h2 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>¿Quién es el impostor?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Selecciona a alguien para votar. Tu voto es secreto.
                    </p>

                    <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                        {alivePlayers
                            .filter(p => p.id !== currentVoter.id)
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

                    <div style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.8rem' }}>
                        Votando: {state.votingIndex + 1} / {alivePlayers.length}
                    </div>
                </div>
            )}
        </div>
    );
};
