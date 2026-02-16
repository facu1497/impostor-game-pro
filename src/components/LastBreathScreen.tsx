import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const LastBreathScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [guess, setGuess] = useState('');

    const caughtImpostor = state.lastVotedPlayer;

    if (!caughtImpostor) return null;

    const handleSubmitGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (guess.trim()) {
            dispatch({ type: 'GUESS_WORD', payload: guess.trim() });
        }
    };

    return (
        <div className="glass-panel" style={{ textAlign: 'center', border: '2px solid var(--neon-red)', boxShadow: '0 0 30px rgba(255, 0, 0, 0.2)' }}>
            <h1 style={{ color: 'var(--neon-red)', textShadow: '0 0 10px var(--neon-red)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                ÚLTIMO ALIENTO 💀
            </h1>

            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.2rem', color: '#fff' }}>
                    ¡<strong>{caughtImpostor.name}</strong> ha sido descubierto!
                </p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Como impostor, tienes una última oportunidad de ganar si adivinas la palabra secreta.
                </p>
            </div>

            <form onSubmit={handleSubmitGuess} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <Input
                    placeholder="Escribe la palabra secreta..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '1.2rem', padding: '1rem', marginBottom: '1.5rem' }}
                />
                <Button type="submit" disabled={!guess.trim()}>
                    ENVIAR ADIVINANZA
                </Button>
            </form>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6, color: 'var(--text-secondary)' }}>
                Si fallas, los ciudadanos ganan automáticamente.
            </div>
        </div>
    );
};
