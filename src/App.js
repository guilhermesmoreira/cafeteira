import React from 'react';
import './App.css';
import Cafeteira from './components/Cafeteira'; 
import Cafeteira2 from './paginas/cafeteira2/cafeteira2';
import Cafeteira3 from './paginas/cafeteira3/cafeteira3';


function App() {
  return (
    <div className="App">
      <h1>Cafeteira Virtual</h1>
      {/* <Cafeteira /> */}
      <Cafeteira2 />
    </div>
  );
}

export default App;