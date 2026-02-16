import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';

export const WelcomeScreen: React.FC = () => {
    const { dispatch } = useGame();

    const handleStart = () => {
        dispatch({ type: 'START_SETUP' });
    };

    return (
        <div className="glass-panel" style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            paddingTop: '3rem',
            paddingBottom: '3rem'
        }}>
            <h1 style={{
                fontSize: '3rem',
                textShadow: '0 0 10px rgba(var(--neon-green-rgb), 0.5)',
                marginBottom: '1rem'
            }}>
                IMPOSTOR
            </h1>

            <div style={{
                position: 'relative',
                width: '280px',
                height: '380px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Glow effect behind character */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(var(--neon-green-rgb), 0.2) 0%, transparent 70%)',
                    zIndex: 0
                }} />

                <img
                    src={`${import.meta.env.BASE_URL}character.png`}
                    alt="Character"
                    style={{
                        height: '100%',
                        objectFit: 'contain',
                        zIndex: 1,
                        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
            </div>

            <Button
                onClick={handleStart}
                style={{
                    fontSize: '1.5rem',
                    padding: '1rem 3rem',
                    marginTop: '1rem',
                    animation: 'pulse 2s infinite'
                }}
            >
                COMENZAR
            </Button>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--neon-green-rgb), 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(var(--neon-green-rgb), 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--neon-green-rgb), 0); }
                }
            `}</style>
        </div>
    );
};
