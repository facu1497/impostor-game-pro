import { GameProvider, useGame } from './context/GameContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { VotingScreen } from './components/VotingScreen';
import { RoundResultsScreen } from './components/RoundResultsScreen';
import { ResultsScreen } from './components/ResultsScreen';

const GameController = () => {
    const { state } = useGame();

    // Simple routing based on phase
    switch (state.phase) {
        case 'WELCOME':
            return <WelcomeScreen />;
        case 'SETUP':
            return <SetupScreen />;
        case 'ROLE_REVEAL':
            return <RoleRevealScreen />;
        case 'ROUND_IN_PROGRESS':
            return <GameScreen />;
        case 'VOTING':
            return <VotingScreen />;
        case 'ROUND_RESULTS':
            return <RoundResultsScreen />;
        case 'RESULTS':
            return <ResultsScreen />;
        default:
            return <div>Error: Unknown Phase</div>;
    }
};

function App() {
    return (
        <GameProvider>
            <GameController />
        </GameProvider>
    );
}

export default App;
