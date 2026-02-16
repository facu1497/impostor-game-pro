import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CATEGORIES } from '../data/words';

export const SetupScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [newPlayerName, setNewPlayerName] = useState('');
    const [categoryId, setCategoryId] = useState(state.selectedCategoryId || CATEGORIES[0].id);
    const [customWord, setCustomWord] = useState('');
    const [impostorKnowsCategory, setImpostorKnowsCategory] = useState(state.impostorKnowsCategory || false);

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            dispatch({ type: 'ADD_PLAYER', payload: newPlayerName.trim() });
            setNewPlayerName('');
        }
    };

    const handleStartGame = () => {
        if (state.players.length < 3) return; // Min players check
        dispatch({
            type: 'START_GAME',
            payload: {
                categoryId,
                customWord: categoryId === 'custom' ? customWord : undefined,
                impostorKnowsCategory: categoryId === 'all' ? impostorKnowsCategory : undefined
            }
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}> {/* Reduced padding */}
            <h1 style={{ marginBottom: '1rem', marginTop: 0 }}>IMPOSTOR</h1> {/* Reduced margin */}

            <div style={{ marginBottom: '1rem' }}> {/* Reduced from 2rem */}
                <h3 style={{ marginBottom: '0.5rem' }}>Jugadores ({state.players.length})</h3>
                <ul style={{ listStyle: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto', marginBottom: '0.5rem' }}> {/* Reduced max-height */}
                    {state.players.map(player => (
                        <li key={player.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>{player.name}</span>
                            <button
                                onClick={() => dispatch({ type: 'REMOVE_PLAYER', payload: player.id })}
                                style={{ background: 'none', border: 'none', color: 'var(--neon-red)', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleAddPlayer} style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input
                        placeholder="Nombre del jugador"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        style={{ marginBottom: 0, padding: '0.6rem' }} // Compact input
                    />
                    <Button type="submit" style={{ width: 'auto', padding: '0.6rem 1rem' }}>+</Button>
                </form>
            </div>

            <div style={{ marginBottom: '1rem' }}> {/* Reduced from 2rem */}
                <h3 style={{ marginBottom: '0.5rem' }}>Configuración</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Impostores</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                            variant="secondary"
                            onClick={() => dispatch({ type: 'SET_IMPOSTOR_COUNT', payload: Math.max(1, state.impostorCount - 1) })}
                            style={{ padding: '0.2rem 0.8rem', width: 'auto', marginBottom: 0 }}
                        >-</Button>
                        <span style={{ fontSize: '1.2rem', alignSelf: 'center', width: '20px', textAlign: 'center' }}>{state.impostorCount}</span>
                        <Button
                            variant="secondary"
                            onClick={() => dispatch({ type: 'SET_IMPOSTOR_COUNT', payload: Math.min(state.players.length - 1, state.impostorCount + 1) })}
                            style={{ padding: '0.2rem 0.8rem', width: 'auto', marginBottom: 0 }}
                        >+</Button>
                    </div>
                </div>

                <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Categoría</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{ marginBottom: '0.5rem', padding: '0.6rem' }}
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {categoryId === 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={impostorKnowsCategory}
                            onChange={(e) => setImpostorKnowsCategory(e.target.checked)}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Impostor conoce la categoría</label>
                    </div>
                )}

                {categoryId === 'custom' && (
                    <Input
                        placeholder="Palabra Secreta"
                        value={customWord}
                        onChange={(e) => setCustomWord(e.target.value)}
                        type="password"
                        style={{ marginBottom: '0.5rem', padding: '0.6rem' }}
                    />
                )}
            </div>

            <Button
                onClick={handleStartGame}
                disabled={state.players.length < 3 || (categoryId === 'custom' && !customWord)}
                style={{ opacity: state.players.length < 3 ? 0.5 : 1, padding: '0.8rem', marginBottom: '0.5rem' }}
            >
                COMENZAR PARTIDA
            </Button>

            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.7rem', margin: '0.5rem 0' }}>
                Mínimo 3 jugadores
            </p>

            <div style={{
                marginTop: '0.5rem', // Reduced margin
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: 0.9,
                width: '100%'
            }}>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.5rem',
                    marginBottom: '0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>
                    Desarrollado por
                </p>
                <div style={{ marginTop: '-0.3rem' }}>
                    <img
                        src={`${import.meta.env.BASE_URL}logo.png`}
                        alt="Klaims Logo"
                        style={{
                            height: '80px', // Reduced height
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5)) brightness(1.2)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
