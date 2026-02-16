export type Role = 'impostor' | 'citizen' | 'spy' | 'jester';
export type GameMode = 'standard' | 'silent';

export interface Player {
  id: string;
  name: string;
  role: Role;
  isAlive: boolean;
  votesReceived: number;
}

export interface Category {
  id: string;
  name: string;
  words: string[];
}

export type GamePhase =
  | 'WELCOME'
  | 'SETUP'
  | 'ROLE_REVEAL'
  | 'ROUND_IN_PROGRESS'
  | 'VOTING'
  | 'DIGITAL_VOTING'
  | 'LAST_BREATH'
  | 'ROUND_RESULTS'
  | 'RESULTS';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  impostorCount: number;
  currentCategory: Category | null; // Can be null if custom
  secretWord: string;
  roundDuration: number; // in seconds, default maybe 300 (5 mins)
  revealIndex: number; // For pass-and-play logic
  votingIndex: number; // For pass-and-play digital voting
  drawingIndex: number; // For Silent Mode pass-and-play drawing
  lastVotedPlayer?: Player;
  impostorKnowsCategory?: boolean; // New flag
  realCategoryName?: string; // For 'All' category hint
  selectedCategoryId?: string;
  useDigitalVoting: boolean;
  useLastBreath: boolean;
  gameMode: GameMode;
  selectedRoles: Role[]; // Roles enabled for this game
  winnerRole?: Role; // To track who won specifically (for Last Breath cases)
}

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export type GameAction =
  | { type: 'START_SETUP' }
  | { type: 'ADD_PLAYER'; payload: string }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'SET_IMPOSTOR_COUNT'; payload: number }
  | {
    type: 'START_GAME'; payload: {
      categoryId: string;
      customWord?: string;
      impostorKnowsCategory?: boolean;
      useDigitalVoting: boolean;
      useLastBreath: boolean;
      gameMode: GameMode;
      selectedRoles: Role[];
    }
  }
  | { type: 'NEXT_REVEAL' }
  | { type: 'START_ROUND' }
  | { type: 'END_ROUND' } // Go to voting
  | { type: 'VOTE_PLAYER'; payload: string }
  | { type: 'SUBMIT_DIGITAL_VOTE'; payload: { voterId: string, targetId: string } }
  | { type: 'GUESS_WORD'; payload: string }
  | { type: 'SUBMIT_DRAWING' }
  | { type: 'CANCEL_GAME' }
  | { type: 'SPY_GUESS'; payload: string }
  | { type: 'NEW_ROUND' }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'RESET_GAME' };
