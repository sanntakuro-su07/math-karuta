import React, { useState, useEffect, useCallback } from 'react';
import { formulas } from './data/formulas';
import { Volume2, VolumeX, Trophy, Award } from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface DifficultyConfig {
  timeLimit: number;
  cpuErrorRate: number;
}

const difficultySettings: Record<Difficulty, DifficultyConfig> = {
  beginner: { timeLimit: 120, cpuErrorRate: 0.3 },
  intermediate: { timeLimit: 60, cpuErrorRate: 0.15 },
  advanced: { timeLimit: 30, cpuErrorRate: 0.02 }
};

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [score, setScore] = useState({ player: 0, cpu: 0 });
  const [currentProblem, setCurrentProblem] = useState<typeof formulas[0] | null>(null);
  const [displayedFormulas, setDisplayedFormulas] = useState<typeof formulas>([]);
  const [muted, setMuted] = useState(false);
  const [penaltyTimer, setPenaltyTimer] = useState(0);
  const [showSelectScreen, setShowSelectScreen] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const playSound = (type: 'correct' | 'wrong' | 'win' | 'lose') => {
    if (muted) return;
    const sounds = {
      correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
      wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
      win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      lose: 'https://assets.mixkit.co/active_storage/sfx/1430/1430-preview.mp3'
    };
    new Audio(sounds[type]).play().catch(() => {});
  };

  const shuffleFormulas = useCallback(() => {
    return [...formulas].sort(() => Math.random() - 0.5).slice(0, 10);
  }, []);

  const startGame = useCallback(() => {
    const shuffled = shuffleFormulas();
    setDisplayedFormulas(shuffled);
    setCurrentProblem(shuffled[0]);
    setScore({ player: 0, cpu: 0 });
    setProblemCount(0);
    setGameStarted(true);
    setShowSelectScreen(false);
    setGameEnded(false);
    setTimeLeft(difficultySettings[difficulty].timeLimit);
  }, [difficulty, shuffleFormulas]);

  const handleFormulaClick = useCallback((formula: typeof formulas[0]) => {
    if (!currentProblem || penaltyTimer > 0 || !gameStarted) return;

    if (formula.id === currentProblem.id) {
      playSound('correct');
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      nextProblem();
    } else {
      playSound('wrong');
      setPenaltyTimer(5);
    }
  }, [currentProblem, penaltyTimer, gameStarted]);

  const nextProblem = useCallback(() => {
    setProblemCount(prev => {
      const next = prev + 1;
      if (next >= 10) {
        endGame();
        return prev;
      }
      setCurrentProblem(displayedFormulas[next]);
      setTimeLeft(difficultySettings[difficulty].timeLimit);
      return next;
    });
  }, [displayedFormulas, difficulty]);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setGameEnded(true);
    const playerWon = score.player > score.cpu;
    playSound(playerWon ? 'win' : 'lose');
  }, [score]);

  useEffect(() => {
    if (!gameStarted || !currentProblem) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          const cpuWillMiss = Math.random() < difficultySettings[difficulty].cpuErrorRate;
          if (!cpuWillMiss) {
            setScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
            playSound('wrong');
            nextProblem();
          }
          return difficultySettings[difficulty].timeLimit;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, currentProblem, difficulty, nextProblem]);

  useEffect(() => {
    if (penaltyTimer <= 0) return;
    const timer = setInterval(() => {
      setPenaltyTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [penaltyTimer]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Mamelon' }}>数学かるた</h1>
          <p className="text-xl mb-4" style={{ fontFamily: 'Mamelon' }}>Mathematical Karuta</p>
          
          <button
            onClick={() => setMuted(!muted)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          >
            {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>

          {showSelectScreen && (
            <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Mamelon' }}>問題に使う公式を選んでね</h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setDifficulty('beginner');
                    setTimeout(startGame, 5000);
                  }}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  style={{ fontFamily: 'Mamelon' }}
                >
                  初級 (2分)
                </button>
                <button
                  onClick={() => {
                    setDifficulty('intermediate');
                    setTimeout(startGame, 5000);
                  }}
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
                  style={{ fontFamily: 'Mamelon' }}
                >
                  中級 (1分)
                </button>
                <button
                  onClick={() => {
                    setDifficulty('advanced');
                    setTimeout(startGame, 5000);
                  }}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  style={{ fontFamily: 'Mamelon' }}
                >
                  上級 (30秒)
                </button>
              </div>
            </div>
          )}

          {gameStarted && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-lg">
                <p className="text-3xl font-bold mb-4" style={{ fontFamily: 'Mamelon' }}>
                  {currentProblem?.problem}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xl" style={{ fontFamily: 'Mamelon' }}>
                    残り時間: <span className="font-bold">{timeLeft}</span>秒
                  </div>
                  <div className="text-xl" style={{ fontFamily: 'Mamelon' }}>
                    問題: <span className="font-bold">{problemCount + 1}</span>/10
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-8 mb-4">
                <div className="text-xl" style={{ fontFamily: 'Mamelon' }}>
                  プレイヤー: <span className="font-bold">{score.player}</span>
                </div>
                <div className="text-xl" style={{ fontFamily: 'Mamelon' }}>
                  CPU: <span className="font-bold">{score.cpu}</span>
                </div>
              </div>
            </>
          )}

          {gameEnded && (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg text-center">
                <div className="text-6xl mb-4">
                  {score.player > score.cpu ? (
                    <Trophy className="mx-auto text-yellow-400" size={80} />
                  ) : (
                    <Award className="mx-auto text-gray-400" size={80} />
                  )}
                </div>
                <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Mamelon' }}>
                  {score.player > score.cpu ? '勝利！' : '敗北...'}
                </h2>
                <p className="text-xl mb-6" style={{ fontFamily: 'Mamelon' }}>
                  最終スコア: {score.player} - {score.cpu}
                </p>
                <button
                  onClick={() => {
                    setShowSelectScreen(true);
                    setGameEnded(false);
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  style={{ fontFamily: 'Mamelon' }}
                >
                  もう一度プレイ
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          {displayedFormulas.map((formula) => (
            <div
              key={formula.id}
              onClick={() => gameStarted && handleFormulaClick(formula)}
              className={`
                relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg 
                transform transition-all duration-200
                ${gameStarted ? 'cursor-pointer hover:scale-105' : ''}
                ${penaltyTimer > 0 ? 'pointer-events-none opacity-50' : ''}
                bg-gray-50
              `}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-lg font-bold text-center" style={{ fontFamily: 'Mamelon' }}>
                  {formula.formula}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;