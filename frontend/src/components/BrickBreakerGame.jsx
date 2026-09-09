import { useState, useEffect, useRef } from 'react';

export default function BrickBreakerGame() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver', 'won'
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const gameDataRef = useRef({
    ball: { x: 175, y: 225, dx: 1.5, dy: -1.5, radius: 7 },
    paddle: { x: 125, y: 235, width: 100, height: 10, speed: 5 },
    bricks: [],
    keys: {},
    ballMoving: false
  });

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize game
  useEffect(() => {
    const gameData = gameDataRef.current;
    gameData.bricks = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        gameData.bricks.push({
          x: c * 42 + 10,
          y: r * 20 + 30,
          width: 38,
          height: 15,
          visible: true
        });
      }
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameData = gameDataRef.current;

    const handleKeyDown = (e) => { gameData.keys[e.key] = true; };
    const handleKeyUp = (e) => { gameData.keys[e.key] = false; };
    
    const handleClick = () => {
      if (gameState === 'start') {
        startGame();
      } else if (gameState === 'gameOver' || gameState === 'won') {
        startGame();
      } else if (!gameData.ballMoving) {
        gameData.ballMoving = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    const gameLoop = () => {
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === 'playing') {
        // Move paddle
        if (gameData.keys['ArrowLeft'] && gameData.paddle.x > 0) {
          gameData.paddle.x -= gameData.paddle.speed;
        }
        if (gameData.keys['ArrowRight'] && gameData.paddle.x < canvas.width - gameData.paddle.width) {
          gameData.paddle.x += gameData.paddle.speed;
        }

        // Move ball
        if (gameData.ballMoving) {
          gameData.ball.x += gameData.ball.dx;
          gameData.ball.y += gameData.ball.dy;

          // Wall collisions
          if (gameData.ball.x - gameData.ball.radius <= 0 || gameData.ball.x + gameData.ball.radius >= canvas.width) {
            gameData.ball.dx = -gameData.ball.dx;
          }
          if (gameData.ball.y - gameData.ball.radius <= 0) {
            gameData.ball.dy = -gameData.ball.dy;
          }

          // Paddle collision
          if (gameData.ball.y + gameData.ball.radius >= gameData.paddle.y &&
              gameData.ball.x >= gameData.paddle.x &&
              gameData.ball.x <= gameData.paddle.x + gameData.paddle.width &&
              gameData.ball.dy > 0) {
            gameData.ball.dy = -gameData.ball.dy;
            // Add some angle based on where it hits the paddle
            const hitPos = (gameData.ball.x - gameData.paddle.x) / gameData.paddle.width;
            gameData.ball.dx = (hitPos - 0.5) * 3;
          }

          // Brick collisions
          gameData.bricks.forEach(brick => {
            if (brick.visible &&
                gameData.ball.x + gameData.ball.radius >= brick.x &&
                gameData.ball.x - gameData.ball.radius <= brick.x + brick.width &&
                gameData.ball.y + gameData.ball.radius >= brick.y &&
                gameData.ball.y - gameData.ball.radius <= brick.y + brick.height) {
              brick.visible = false;
              gameData.ball.dy = -gameData.ball.dy;
              setScore(prev => prev + 10);
            }
          });

          // Check if all bricks are destroyed
          if (gameData.bricks.every(brick => !brick.visible)) {
            setGameState('won');
            return;
          }

          // Game over
          if (gameData.ball.y > canvas.height) {
            setGameState('gameOver');
            return;
          }
        } else {
          // Ball sticks to paddle
          gameData.ball.x = gameData.paddle.x + gameData.paddle.width / 2;
          gameData.ball.y = gameData.paddle.y - gameData.ball.radius;
        }

        // Draw ball in gray
        ctx.beginPath();
        ctx.arc(gameData.ball.x, gameData.ball.y, gameData.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6b7280';
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw paddle with rounded corners
        const radius = gameData.paddle.height / 2;
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.roundRect(gameData.paddle.x, gameData.paddle.y, gameData.paddle.width, gameData.paddle.height, radius);
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw bricks in gray
        gameData.bricks.forEach((brick, index) => {
          if (brick.visible) {
            ctx.fillStyle = '#6b7280';
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 1;
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
          }
        });

        // Draw instructions
        if (!gameData.ballMoving) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.font = 'bold 18px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Click to launch', canvas.width / 2, canvas.height / 2);
        }
      } else {
        // Draw waiting screen with game elements
        // Draw static paddle with rounded corners
        const radius = gameData.paddle.height / 2;
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.roundRect(gameData.paddle.x, gameData.paddle.y, gameData.paddle.width, gameData.paddle.height, radius);
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw static ball in gray
        ctx.beginPath();
        ctx.arc(gameData.ball.x, gameData.ball.y, gameData.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6b7280';
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw static bricks in gray
        gameData.bricks.forEach((brick, index) => {
          if (brick.visible) {
            ctx.fillStyle = '#6b7280';
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 1;
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
          }
        });
      }

      gameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    const gameData = gameDataRef.current;
    gameData.ball = { x: 175, y: 225, dx: 1.5, dy: -1.5, radius: 7 };
    gameData.paddle = { x: 125, y: 235, width: 100, height: 10, speed: 5 };
    gameData.ballMoving = false;
    gameData.bricks.forEach(brick => brick.visible = true);
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="bg-white p-4 border border-ds-edge max-w-sm mx-auto">
      {!isMobile && (
        <div className="text-center mb-3">
          <h4 className="text-card-title text-navy mb-1.5">Mini game</h4>
          <div className="flex justify-center items-center gap-2 text-label">
            <span className="bg-ds-blue-tint text-ds-blue px-2 py-1 font-medium tabular-nums">Score: {score}</span>
            <span className="text-ds-ink-faint">Use ← → arrows</span>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="text-center py-6">
          <div className="bg-ds-ground border border-ds-edge p-3">
            <p className="text-body text-ds-ink-soft mb-1">Game not available on mobile</p>
            <p className="text-label text-ds-ink-faint">Please use a desktop to play</p>
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={350}
            height={250}
            className="border border-ds-edge bg-ds-ground mx-auto block cursor-pointer"
          />

          <div className="text-center mt-3">
            {gameState === 'start' && (
              <div className="border-t-2 border-ds-red bg-ds-red-tint p-2">
                <p className="text-label font-medium text-ds-red-deep">Click to play</p>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="border-t-2 border-navy bg-ds-blue-tint p-2">
                <p className="text-label font-medium text-ds-blue">Destroy all bricks</p>
              </div>
            )}

            {gameState === 'gameOver' && (
              <div className="border-t-2 border-ds-red bg-ds-red-tint p-2">
                <p className="text-label font-semibold text-ds-red-deep mb-1">Game over</p>
                <p className="text-label text-ds-red-deep mb-1 tabular-nums">Score: {score}</p>
                <p className="text-label text-ds-ink-soft italic mb-1">"Can't you even win this simple game?"</p>
                <p className="text-label text-ds-ink-faint">Click to retry</p>
              </div>
            )}

            {gameState === 'won' && (
              <div className="border-t-2 border-navy bg-ds-blue-tint p-2">
                <p className="text-label font-semibold text-navy mb-1">You won</p>
                <p className="text-label text-ds-blue mb-1 tabular-nums">Score: {score}</p>
                <p className="text-label text-ds-ink-soft italic mb-1">"Only if you had the same focus on your subjects!"</p>
                <p className="text-label text-ds-ink-faint">Click to play again</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}