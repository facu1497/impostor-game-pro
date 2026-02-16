import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const VotingScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const handleVote = () => {
        if (selectedPlayerId) {
            // In a real networked game, we'd wait for all votes.
            // Here, we just simulate the group consensus or single vote.
            // For simplicity in this offline version: "Who does the group vote out?"
            // So we just pick one person to eliminate/accuse.
            dispatch({ type: 'VOTE_PLAYER', payload: selectedPlayerId });
        }
    };

    return (
        <div className="glass-panel">
            <h2>VOTACIÓN</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                ¿Quién es el impostor?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {state.players.filter(p => p.isAlive).map(player => (
                    <button
                        key={player.id}
                        onClick={() => setSelectedPlayerId(player.id)}
                        style={{
                            background: selectedPlayerId === player.id ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)',
                            color: selectedPlayerId === player.id ? '#000' : '#fff',
                            border: selectedPlayerId === player.id ? '2px solid var(--neon-blue)' : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '1rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textShadow: selectedPlayerId === player.id ? 'none' : '0 0 5px rgba(0,0,0,0.5)'
                        }}
                    >
                        {player.name}
                    </button>
                ))}
            </div>

            <Button onClick={handleVote} disabled={!selectedPlayerId}>
                CONFIRMAR VOTO
            </Button>
        </div>
    );
};
