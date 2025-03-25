import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Importa ferramentas de roteamento

import Cafeteira2 from './paginas/cafeteira2/cafeteira2';
import Cafeteira3 from './paginas/cafeteira3/cafeteira3';
import Cafeteira from './paginas/cafeteira1/Cafeteira';

// Componente da página inicial com os botões
function Home() {
  return (
    <div className="home">
      <h1>Cafeteira Virtual</h1>
      <div>
        <button>
          <Link to="/cafeteira1" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 1
          </Link>
        </button>
        <button>
          <Link to="/cafeteira2" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 2
          </Link>
        </button>
        <button>
          <Link to="/cafeteira3" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 3
          </Link>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router> {/* Envolve tudo com o Router */}
      <div className="App">
        <Routes> {/* Define as rotas */}
          <Route path="/" element={<Home />} /> {/* Página inicial */}
          <Route path="/cafeteira1" element={<Cafeteira />} /> {/* Rota para Cafeteira 1 */}
          <Route path="/cafeteira2" element={<Cafeteira2 />} /> {/* Rota para Cafeteira 2 */}
          <Route path="/cafeteira3" element={<Cafeteira3 />} /> {/* Rota para Cafeteira 3 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;