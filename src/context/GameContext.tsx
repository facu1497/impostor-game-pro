import React, { createContext, useReducer, type ReactNode, useContext } from 'react';
import type { GameState, GameAction, Player, GamePhase } from '../types';
import { getRandomWord, baseCategories, CATEGORIES } from '../data/words';

const initialState: GameState = {
    phase: 'WELCOME',
    players: [],
    impostorCount: 1,
    currentCategory: null,
    secretWord: '',
    roundDuration: 300,
    revealIndex: 0,
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
            const { categoryId, customWord, impostorKnowsCategory } = action.payload;
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
            const roles: ('impostor' | 'citizen')[] = Array(totalPlayers).fill('citizen');
            let assignedImpostors = 0;
            while (assignedImpostors < impostorCount) {
                const idx = Math.floor(Math.random() * totalPlayers);
                if (roles[idx] === 'citizen') {
                    roles[idx] = 'impostor';
                    assignedImpostors++;
                }
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
                selectedCategoryId: categoryId
            };

        case 'NEXT_REVEAL':
            if (state.revealIndex >= state.players.length - 1) {
                return { ...state, phase: 'ROUND_IN_PROGRESS' };
            }
            return { ...state, revealIndex: state.revealIndex + 1 };

        case 'START_ROUND':
            return { ...state, phase: 'ROUND_IN_PROGRESS' };

        case 'END_ROUND':
            return { ...state, phase: 'VOTING' };

        case 'VOTE_PLAYER':
            const updatedPlayers = state.players.map(p =>
                p.id === action.payload ? { ...p, isAlive: false, votesReceived: p.votesReceived + 1 } : p
            );

            // Count active players
            const activePlayers = updatedPlayers.filter(p => p.isAlive);
            const activeImpostors = activePlayers.filter(p => p.role === 'impostor');
            const activeCitizens = activePlayers.filter(p => p.role === 'citizen');

            const votedPlayer = updatedPlayers.find(p => p.id === action.payload);

            let nextPhase: GamePhase = 'ROUND_RESULTS'; // Intermediate Screen

            console.log('--- Vote Debug ---');
            console.log('Total Players:', updatedPlayers.length);
            console.log('Active Players:', activePlayers.length);
            console.log('Active Impostors:', activeImpostors.length);
            console.log('Active Citizens:', activeCitizens.length);

            // Win Conditions
            if (activeImpostors.length === 0) {
                console.log('WIN: Citizens (0 impostors left)');
                nextPhase = 'RESULTS'; // Citizens Win
            } else if (activeImpostors.length >= activeCitizens.length) {
                console.log('WIN: Impostors (Impostors >= Citizens)');
                nextPhase = 'RESULTS'; // Impostors Win
            } else {
                console.log('CONTINUE: Round Results');
            }

            return {
                ...state,
                players: updatedPlayers,
                phase: nextPhase,
                lastVotedPlayer: votedPlayer // Store for result screen
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
