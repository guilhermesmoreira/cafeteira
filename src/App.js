import React from 'react';
import './App.css';
import Cafeteira from './components/Cafeteira'; 
import Cafeteira3 from './paginas/cafeteira3';


function App() {
  return (
    <div className="App">
      <h1>Cafeteira Virtual</h1>
      {/* <Cafeteira /> */}
      <Cafeteira3 />
    </div>
  );
}

export default App;