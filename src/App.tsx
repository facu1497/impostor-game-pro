import { GameProvider, useGame } from './context/GameContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { VotingScreen } from './components/VotingScreen';
import { RoundResultsScreen } from './components/RoundResultsScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LastBreathScreen } from './components/LastBreathScreen';

const GameController = () => {
    const { state, dispatch } = useGame();

    const showCancel = state.phase !== 'WELCOME' && state.phase !== 'SETUP' && state.phase !== 'RESULTS';

    const renderScreen = () => {
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
            case 'DIGITAL_VOTING':
                return <VotingScreen />;
            case 'LAST_BREATH':
                return <LastBreathScreen />;
            case 'ROUND_RESULTS':
                return <RoundResultsScreen />;
            case 'RESULTS':
                return <ResultsScreen />;
            default:
                return <div>Error: Unknown Phase</div>;
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {showCancel && (
                <button
                    className="cancel-button"
                    onClick={() => dispatch({ type: 'CANCEL_GAME' })}
                    title="Cancelar Partida"
                >
                    &times;
                </button>
            )}
            {renderScreen()}
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <GameController />
        </GameProvider>
    );
}

export default App;
