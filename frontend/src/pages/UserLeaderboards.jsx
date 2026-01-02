import React, { useState } from 'react';
import { EnigmaLeaderboard, GenesisLeaderboard } from '../components/UserLeaderboardBox';

function UserLeaderboards() {
    const [activeLeaderboard, setActiveLeaderboard] = useState('enigma');
    const [activeEnigmaTab, setActiveEnigmaTab] = useState('first_years');

    const renderLeaderboardContent = () => {
        if (activeLeaderboard === 'enigma') {
            // Pass the sub-state and setter down to EnigmaLeaderboard
            return (
                <EnigmaLeaderboard
                    activeSubTab={activeEnigmaTab}
                    setActiveSubTab={setActiveEnigmaTab}
                />
            );
        }
        return <GenesisLeaderboard />;
    };

    return (
        <div className="min-h-screen bg-white p-6 sm:p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-center text-4xl sm:text-5xl font-bold mb-12 text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Leaderboard</h1>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-8">
                    <header className="mb-8">
                        <div className="flex justify-center gap-4">
                            {/* Main Tabs */}
                            <button
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    activeLeaderboard === 'enigma'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setActiveLeaderboard('enigma')}
                            >
                                Enigma
                            </button>
                            <button
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    activeLeaderboard === 'genesis'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setActiveLeaderboard('genesis')}
                            >
                                Genesis
                            </button>
                        </div>
                    </header>

                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                        {renderLeaderboardContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLeaderboards;