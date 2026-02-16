import React, { createContext, useReducer, type ReactNode, useContext } from 'react';
import type { GameState, GameAction, Player, GamePhase, Role } from '../types';
import { getRandomWord, baseCategories, CATEGORIES } from '../data/words';

const initialState: GameState = {
    phase: 'WELCOME',
    players: [],
    impostorCount: 1,
    currentCategory: null,
    secretWord: '',
    roundDuration: 300,
    revealIndex: 0,
    votingIndex: 0,
    drawingIndex: 0,
    useDigitalVoting: false,
    useLastBreath: false,
    gameMode: 'standard',
    selectedRoles: ['impostor', 'citizen'],
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_SETUP':
            return { ...state, phase: 'SETUP' };

        case 'ADD_PLAYER':
            const newPlayer: Player = {
                id: crypto.randomUUID(),
                name: action.payload,
                role: 'citizen',
                isAlive: true,
                votesReceived: 0,
            };
            return { ...state, players: [...state.players, newPlayer] };

        case 'REMOVE_PLAYER':
            return {
                ...state,
                players: state.players.filter((p) => p.id !== action.payload),
            };

        case 'SET_IMPOSTOR_COUNT':
            return { ...state, impostorCount: action.payload };

        case 'START_GAME':
            // 1. Assign Roles
            const {
                categoryId,
                customWord,
                impostorKnowsCategory,
                useDigitalVoting,
                useLastBreath,
                gameMode,
                selectedRoles
            } = action.payload;
            const totalPlayers = state.players.length;
            const impostorCount = state.impostorCount;

            let secretWord = customWord || '';
            let currentCategoryName = '';
            let realCategoryName = '';

            // Handle CATEGORY SELECTION
            if (!customWord) {
                if (categoryId === 'all') {
                    // Pick a random category from baseCategories
                    const randomCatIndex = Math.floor(Math.random() * baseCategories.length);
                    const selectedCat = baseCategories[randomCatIndex];

                    // Pick word from that category
                    const randomWordIndex = Math.floor(Math.random() * selectedCat.words.length);
                    secretWord = selectedCat.words[randomWordIndex];

                    currentCategoryName = 'Todas';
                    realCategoryName = selectedCat.name;
                } else {
                    // Normal behavior
                    secretWord = getRandomWord(categoryId);
                    const cat = CATEGORIES.find(c => c.id === categoryId);
                    currentCategoryName = cat ? cat.name : '';
                    realCategoryName = currentCategoryName;
                }
            } else {
                currentCategoryName = 'Personalizado';
                realCategoryName = 'Personalizado';
            }

            // Create array of roles
            const roles: Role[] = Array(totalPlayers).fill('citizen');
            const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i);

            const getRandomIndex = () => {
                const idx = Math.floor(Math.random() * availableIndices.length);
                return availableIndices.splice(idx, 1)[0];
            };

            // Assign Impostors
            for (let i = 0; i < impostorCount; i++) {
                if (availableIndices.length > 0) {
                    roles[getRandomIndex()] = 'impostor';
                }
            }

            // Assign Spy (if selected and enough players)
            if (selectedRoles.includes('spy') && availableIndices.length > 0) {
                roles[getRandomIndex()] = 'spy';
            }

            // Assign Jester (if selected and enough players)
            if (selectedRoles.includes('jester') && availableIndices.length > 0) {
                roles[getRandomIndex()] = 'jester';
            }

            // Assign to players
            const playersWithRoles = state.players.map((p, i) => ({
                ...p,
                role: roles[i],
                isAlive: true,
                votesReceived: 0
            }));

            // Shuffle players for reveal order (optional, but good for randomness)
            // For now, keep order or shuffle? Let's keep order of entry or just shuffle roles above.
            // The roles are assigned randomly to indices.

            return {
                ...state,
                phase: 'ROLE_REVEAL',
                players: playersWithRoles,
                secretWord,
                revealIndex: 0,
                impostorKnowsCategory: !!impostorKnowsCategory,
                realCategoryName,
                currentCategory: CATEGORIES.find(c => c.id === categoryId) || null,
                selectedCategoryId: categoryId,
                useDigitalVoting,
                useLastBreath,
                gameMode,
                selectedRoles
            };

        case 'NEXT_REVEAL':
            if (state.revealIndex >= state.players.length - 1) {
                return { ...state, phase: 'ROUND_IN_PROGRESS' };
            }
            return { ...state, revealIndex: state.revealIndex + 1 };

        case 'START_ROUND':
            return { ...state, phase: 'ROUND_IN_PROGRESS' };

        case 'END_ROUND':
            return {
                ...state,
                phase: state.useDigitalVoting ? 'DIGITAL_VOTING' : 'VOTING',
                votingIndex: 0 // Initialize for digital voting pass-the-device logic
            };

        case 'VOTE_PLAYER':
            const updatedPlayers = state.players.map(p =>
                p.id === action.payload ? { ...p, isAlive: false, votesReceived: p.votesReceived + 1 } : p
            );

            // Count active players
            const activePlayers = updatedPlayers.filter(p => p.isAlive);
            const activeImpostors = activePlayers.filter(p => p.role === 'impostor' || p.role === 'spy');
            const activeCitizens = activePlayers.filter(p => p.role === 'citizen');

            const votedPlayer = updatedPlayers.find(p => p.id === action.payload);

            let nextPhase: GamePhase = 'ROUND_RESULTS'; // Intermediate Screen

            console.log('--- Vote Debug ---');
            console.log('Total Players:', updatedPlayers.length);
            console.log('Active Players:', activePlayers.length);
            console.log('Active Impostors:', activeImpostors.length);
            console.log('Active Citizens:', activeCitizens.length);

            // Win Conditions
            let winnerRole: Role | undefined = undefined;

            if (votedPlayer?.role === 'jester') {
                console.log('WIN: Jester (Voted out!)');
                nextPhase = 'RESULTS';
                winnerRole = 'jester';
            } else if (activeImpostors.length === 0) {
                console.log('WIN: Citizens (0 impostors left)');
                if (state.useLastBreath) {
                    nextPhase = 'LAST_BREATH';
                } else {
                    nextPhase = 'RESULTS'; // Citizens Win
                    winnerRole = 'citizen';
                }
            } else if (activeImpostors.length >= activeCitizens.length) {
                console.log('WIN: Impostors (Impostors >= Citizens)');
                nextPhase = 'RESULTS'; // Impostors Win
                winnerRole = 'impostor';
            } else {
                console.log('CONTINUE: Round Results');
            }

            return {
                ...state,
                players: updatedPlayers,
                phase: nextPhase,
                lastVotedPlayer: votedPlayer, // Store for result screen
                winnerRole
            };

        case 'SUBMIT_DIGITAL_VOTE':
            const { targetId } = action.payload;
            const aliveP = state.players.filter(p => p.isAlive);

            const playersAV = state.players.map(p =>
                p.id === targetId ? { ...p, votesReceived: p.votesReceived + 1 } : p
            );

            if (state.votingIndex < aliveP.length - 1) {
                // Next player's turn to vote
                return {
                    ...state,
                    players: playersAV,
                    votingIndex: state.votingIndex + 1
                };
            } else {
                // All votes are in! Find the most voted player
                const tallies = playersAV.filter(p => p.isAlive);
                const maxVotes = Math.max(...tallies.map(p => p.votesReceived));
                const mostVoted = tallies.find(p => p.votesReceived === maxVotes);

                if (!mostVoted) return state;

                // Now execute the same logic as VOTE_PLAYER for 'mostVoted.id'
                const finalPlayers = state.players.map(p =>
                    p.id === mostVoted.id ? { ...p, isAlive: false, votesReceived: p.votesReceived + 1 } : p
                );

                const remainingPlayers = finalPlayers.filter(p => p.isAlive);
                const remainingImpostors = remainingPlayers.filter(p => p.role === 'impostor' || p.role === 'spy');
                const remainingCitizens = remainingPlayers.filter(p => p.role === 'citizen');

                let nextPhase: GamePhase = 'ROUND_RESULTS';
                let winnerRole: Role | undefined = undefined;

                if (mostVoted.role === 'jester') {
                    nextPhase = 'RESULTS';
                    winnerRole = 'jester';
                } else if (remainingImpostors.length === 0) {
                    if (state.useLastBreath) {
                        nextPhase = 'LAST_BREATH';
                    } else {
                        nextPhase = 'RESULTS';
                        winnerRole = 'citizen';
                    }
                } else if (remainingImpostors.length >= remainingCitizens.length) {
                    nextPhase = 'RESULTS';
                    winnerRole = 'impostor';
                }

                return {
                    ...state,
                    players: finalPlayers,
                    phase: nextPhase,
                    lastVotedPlayer: mostVoted,
                    winnerRole
                };
            }

        case 'GUESS_WORD':
            const isCorrect = action.payload.trim().toLowerCase() === state.secretWord.toLowerCase();
            return {
                ...state,
                phase: 'RESULTS',
                winnerRole: isCorrect ? 'impostor' : 'citizen'
            };

        case 'SUBMIT_DRAWING':
            const playersAlive = state.players.filter(p => p.isAlive);
            if (state.drawingIndex < playersAlive.length - 1) {
                return { ...state, drawingIndex: state.drawingIndex + 1 };
            } else {
                return {
                    ...state,
                    phase: state.useDigitalVoting ? 'DIGITAL_VOTING' : 'VOTING',
                    votingIndex: 0
                };
            }

        case 'CANCEL_GAME':
            return {
                ...state,
                phase: 'SETUP'
            };

        case 'SPY_GUESS':
            const isSpyCorrect = action.payload.trim().toLowerCase() === state.secretWord.toLowerCase();
            return {
                ...state,
                phase: 'RESULTS',
                winnerRole: isSpyCorrect ? 'impostor' : 'citizen'
            };

        case 'NEW_ROUND':
            return { ...state, phase: 'ROUND_IN_PROGRESS' };

        case 'CALCULATE_RESULTS':
            // Deprecated in favor of immediate check in VOTE_PLAYER
            return { ...state, phase: 'RESULTS' };

        case 'RESET_GAME':
            return {
                ...initialState,
                phase: 'SETUP',
                players: state.players.map(p => ({ ...p, role: 'citizen', votesReceived: 0, isAlive: true })),
                // Persist settings
                impostorCount: state.impostorCount,
                selectedCategoryId: state.selectedCategoryId,
                impostorKnowsCategory: state.impostorKnowsCategory
            };
        default:
            return state;
    }
};

const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
