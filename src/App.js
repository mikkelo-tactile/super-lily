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
          <div className={'relative h-[26rem] w-full bg-sky-100 flex items-center justify-center cursor-pointer'} onClick={() => setStartGame(true)}>
            <img className={'z-1 absolute object-cover top-0 w-full h-full'} src="/SuperLily_intro.jpg" alt="end card"></img>
            <h1 className={'z-2 text-3xl absolute bottom-4 text-white font-bold'}>Click to play</h1>
            
            </div>
      }
      
      </div>
      </div>
    
  );
}

export default App;
