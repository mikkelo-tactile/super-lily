import { useState } from 'react';
import MarioGame from './mario-game'


function App() {
  const [ startGame, setStartGame ] = useState(false)
  const [seed, setSeed] = useState(1);
  
  return (
    <div className='flex justify-center items-center w-screen h-screen'>
    <div className='w-full max-w-[50rem]'>
     
      {startGame 
        ? 
          <MarioGame key={seed} reload={() => setSeed(Math.random())}/> 
        : 
          <div className={'h-96 w-full bg-sky-100 flex items-center justify-center cursor-pointer'} onClick={() => setStartGame(true)}>start game</div>
      }
      
      </div>
      </div>
    
  );
}

export default App;
