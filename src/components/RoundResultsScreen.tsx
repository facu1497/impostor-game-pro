import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const RoundResultsScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const votedPlayer = state.lastVotedPlayer;

    if (!votedPlayer) return <div>Error: No voted player</div>;

    const wasImpostor = votedPlayer.role === 'impostor';

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>RESULTADO DE LA RONDA</h2>

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {votedPlayer.name}
                </h1>
                <p style={{ fontSize: '1.2rem' }}>fue eliminado/a.</p>
            </div>

            <div style={{
                padding: '2rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                background: 'rgba(0,0,0,0.6)', // Darker background for image contrast
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '300px', // Ensure enough space for the image
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Background Image - Only for Citizens as requested */}
                {!wasImpostor && (
                    <img
                        src={`${import.meta.env.BASE_URL}citizen-reveal.png`}
                        alt="Citizen Reveal"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            opacity: 0.4, // Keep it subtle behind text
                            zIndex: 1
                        }}
                    />
                )}

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <p style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.5rem', fontWeight: 500 }}>Su rol era:</p>
                    <h2 style={{
                        color: wasImpostor ? 'var(--neon-red)' : 'var(--neon-green)',
                        fontSize: '4rem', // Bigger impact
                        margin: 0,
                        fontWeight: 900,
                        letterSpacing: '4px',
                        textShadow: wasImpostor
                            ? '0 0 20px var(--neon-red), 0 0 40px var(--neon-red)'
                            : '0 0 20px var(--neon-green), 0 0 40px var(--neon-green)'
                    }}>
                        {wasImpostor ? 'IMPOSTOR' : 'CIUDADANO'}
                    </h2>
                </div>
            </div>

            <p style={{ marginBottom: '2rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                {wasImpostor
                    ? "¡Uno menos! Pero el juego continúa..."
                    : "¡Se equivocaron! El Impostor sigue libre..."}
            </p>

            <Button onClick={() => dispatch({ type: 'NEW_ROUND' })}>
                CONTINUAR PARTIDA
            </Button>
        </div>
    );
};
