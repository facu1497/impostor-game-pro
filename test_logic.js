const simulateVote = (players, voteId) => {
    const updatedPlayers = players.map(p =>
        p.id === voteId ? { ...p, isAlive: false } : p
    );

    const activePlayers = updatedPlayers.filter(p => p.isAlive);
    const activeImpostors = activePlayers.filter(p => p.role === 'impostor');
    const activeCitizens = activePlayers.filter(p => p.role === 'citizen');

    console.log(`Remaining: ${activePlayers.length} (Imp: ${activeImpostors.length}, Cit: ${activeCitizens.length})`);

    if (activeImpostors.length === 0) {
        return 'CITIZENS_WIN';
    } else if (activeImpostors.length >= activeCitizens.length) {
        return 'IMPOSTORS_WIN';
    }
    return 'CONTINUE';
};

// Test Case 1: 3 Players (1 Imp, 2 Cit) -> Vote Citizen
const p1 = [
    { id: '1', role: 'impostor', isAlive: true },
    { id: '2', role: 'citizen', isAlive: true },
    { id: '3', role: 'citizen', isAlive: true }
];
console.log('Test 1: 3 Players (1 Imp, 2 Cit), Vote Citizen (id: 2)');
console.log('Result:', simulateVote(p1, '2')); // Expect IMPOSTORS_WIN

// Test Case 2: 4 Players (1 Imp, 3 Cit) -> Vote Citizen
const p2 = [
    { id: '1', role: 'impostor', isAlive: true },
    { id: '2', role: 'citizen', isAlive: true },
    { id: '3', role: 'citizen', isAlive: true },
    { id: '4', role: 'citizen', isAlive: true }
];
console.log('\nTest 2: 4 Players (1 Imp, 3 Cit), Vote Citizen (id: 2)');
console.log('Result:', simulateVote(p2, '2')); // Expect CONTINUE

// Test Case 3: 4 Players (1 Imp, 3 Cit) -> Vote Impostor
console.log('\nTest 3: 4 Players (1 Imp, 3 Cit), Vote Impostor (id: 1)');
console.log('Result:', simulateVote(p2, '1')); // Expect CITIZENS_WIN
