import React, { useState, useEffect } from 'react';
const platforms = [
  { x: 0, y: 300, width: 800, height: 20 },
  { x: 200, y: 250, width: 100, height: 20 },
  { x: 350, y: 200, width: 100, height: 20 },
];
const MarioGame = ({reload}) => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [facingRight, setFacingRight] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [coins, setCoins] = useState([
    { x: 200, y: 200 },
    { x: 300, y: 150 },
    { x: 400, y: 200 },
  ]);



  const gravity = 0.5;
  const jumpForce = -12;
  const moveSpeed = 5;

  // Sprite animation frames (base64 encoded SVG frames for Mario-like character)
  const spriteFrames = {
    idle: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <rect x="12" y="0" width="16" height="12" fill="#80241e"/>
        <rect x="10" y="12" width="20" height="14" fill="#f45356"/>
        <rect x="16" y="4" width="8" height="8" fill="#ffb6b6"/>
        <rect x="20" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="12" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="12" y="36" width="8" height="4" fill="#964B00"/>
        <rect x="20" y="36" width="8" height="4" fill="#964B00"/>
      </svg>`,
    walk1: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <rect x="12" y="0" width="16" height="12" fill="#80241e"/>
        <rect x="10" y="12" width="20" height="14" fill="#f45356"/>
        <rect x="16" y="4" width="8" height="8" fill="#ffb6b6"/>
        <rect x="22" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="10" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="10" y="36" width="8" height="4" fill="#964B00"/>
        <rect x="22" y="36" width="8" height="4" fill="#964B00"/>
      </svg>  
    `,
    walk2: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <rect x="12" y="0" width="16" height="12" fill="#80241e"/>
        <rect x="10" y="12" width="20" height="14" fill="#f45356"/>
        <rect x="16" y="4" width="8" height="8" fill="#ffb6b6"/>
        <rect x="16" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="16" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="16" y="36" width="8" height="4" fill="#964B00"/>
        <rect x="16" y="36" width="8" height="4" fill="#964B00"/>
      </svg>`,
    jump: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <rect x="12" y="0" width="16" height="12" fill="#80241e"/>
        <rect x="10" y="12" width="20" height="14" fill="#f45356"/>
        <rect x="16" y="4" width="8" height="8" fill="#ffb6b6"/>
        <rect x="24" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="8" y="26" width="8" height="12" fill="#2c567c"/>
        <rect x="8" y="36" width="8" height="4" fill="#964B00"/>
        <rect x="24" y="36" width="8" height="4" fill="#964B00"/>
      </svg>  `
  };

  const getSprite = () => {
    if (isJumping) {
      return `data:image/svg+xml;base64,${btoa(spriteFrames.jump)}`;
    }
    if (!isMoving) {
      return `data:image/svg+xml;base64,${btoa(spriteFrames.idle)}`;
    }
    return `data:image/svg+xml;base64,${btoa(currentFrame % 2 === 0 ? spriteFrames.walk1 : spriteFrames.walk2)}`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          setVelocity(prev => ({ ...prev, x: -moveSpeed }));
          setFacingRight(false);
          setIsMoving(true);
          break;
        case 'ArrowRight':
          setVelocity(prev => ({ ...prev, x: moveSpeed }));
          setFacingRight(true);
          setIsMoving(true);
          break;
        case ' ':
          if (!isJumping) {
            setVelocity(prev => ({ ...prev, y: jumpForce }));
            setIsJumping(true);
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setVelocity(prev => ({ ...prev, x: 0 }));
        setIsMoving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, jumpForce]);

  // Animation frame updater
  useEffect(() => {
    if (isMoving) {
      const frameInterval = setInterval(() => {
        setCurrentFrame(prev => prev + 1);
      }, 150);
      return () => clearInterval(frameInterval);
    }
  }, [isMoving]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerPos(prev => {
        const newPos = {
          x: prev.x + velocity.x,
          y: prev.y + velocity.y
        };

        // Apply gravity
        setVelocity(prev => ({ ...prev, y: prev.y + gravity }));

        // Check platform collisions
        let onPlatform = false;
        platforms.forEach(platform => {
          if (newPos.x + 40 > platform.x &&
              newPos.x < platform.x + platform.width &&
              newPos.y + 40 > platform.y &&
              prev.y + 40 <= platform.y) {
            newPos.y = platform.y - 40;
            setVelocity(prev => ({ ...prev, y: 0 }));
            setIsJumping(false);
            onPlatform = true;
          }
        });

        // Check coin collisions
        setCoins(prevCoins => {
          const newCoins = prevCoins.filter(coin => {
            const collision = 
              newPos.x + 40 > coin.x &&
              newPos.x < coin.x + 20 &&
              newPos.y + 40 > coin.y &&
              newPos.y < coin.y + 20;
            
            if (collision) {
              setScore(prev => prev + 10);
              return false;
            }
            return true;
          });
          return newCoins;
        });

        // Bound checking
        newPos.x = Math.max(0, Math.min(newPos.x, 760));
        newPos.y = Math.min(newPos.y, 260);

        return newPos;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [velocity]);

  return (
    <>
    {score === 30 ?  
      <div 
        className={'h-96 w-full bg-sky-100 flex flex-col items-center justify-center cursor-pointer'}
        onClick={() => reload(Math.random())}
      >
        <h1>You won!!</h1>
        <h2>Click to play again</h2>
      </div>
      
    :
    <div className="relative w-full h-96 bg-sky-200 overflow-hidden border-4 border-gray-800 rounded-lg">
      {/* Score */}
      <div className="absolute top-4 left-4 text-xl font-bold">
        Score: {score}
      </div>

      {/* Player */}
      <div 
        className="absolute w-10 h-10"
        style={{ 
          left: `${playerPos.x}px`, 
          top: `${playerPos.y}px`,
          transition: 'transform 0.1s',
          transform: `scaleX(${facingRight ? 1 : -1})`,
          backgroundImage: `url('${getSprite()}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Platforms */}
      {platforms.map((platform, index) => (
        <div
          key={index}
          className="absolute bg-green-800"
          style={{
            left: `${platform.x}px`,
            top: `${platform.y}px`,
            width: `${platform.width}px`,
            height: `${platform.height}px`
          }}
        />
      ))}

      {/* Coins */}
      {coins.map((coin, index) => (
        <div
          key={index}
          className="absolute w-5 h-5 bg-yellow-400 rounded-full"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`
          }}
        />
      ))}
    </div>
    
    
    }
    </>
  );
};

export default MarioGame;
