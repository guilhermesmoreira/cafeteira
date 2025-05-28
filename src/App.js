import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Importa ferramentas de roteamento

import Cafeteira from './paginas/cafeteira1/Cafeteira';
import Cafeteira2 from './paginas/cafeteira2/cafeteira2';
import Cafeteira3 from './paginas/cafeteira3/cafeteira3';
import Cafeteira4 from './paginas/cafeteira4/cafeteira4';
import Cafeteira5 from './paginas/cafeteira5/cafeteira5';
import Cafeteira6 from './paginas/cafeteira6/cafeteira6';
import Cafeteira7 from './paginas/cafeteira7/cafeteira7';
import Cafeteira8 from './paginas/cafeteira8/cafeteira8';
import Cafeteira9 from './paginas/cafeteira9/cafeteira9';

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
        <button>
          <Link to="/cafeteira4" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 4
          </Link>
        </button>
        <button>
          <Link to="/cafeteira5" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 5
          </Link>
        </button>
        <button>
          <Link to="/cafeteira6" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 6
          </Link>
        </button>
        <button>
          <Link to="/cafeteira7" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 7
          </Link>
        </button>
        <button>
          <Link to="/cafeteira8" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 8
          </Link>
        </button>
        <button>
          <Link to="/cafeteira9" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cafeteira 9
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
          <Route path="/cafeteira4" element={<Cafeteira4 />} /> {/* Rota para Cafeteira 3 */}
          <Route path="/cafeteira5" element={<Cafeteira5 />} /> {/* Rota para Cafeteira 3 */}
          <Route path="/cafeteira6" element={<Cafeteira6 />} /> {/* Rota para Cafeteira 6 */}
          <Route path="/cafeteira7" element={<Cafeteira7 />} /> {/* Rota para Cafeteira 7 */}
          <Route path="/cafeteira8" element={<Cafeteira8 />} /> {/* Rota para Cafeteira 8 */}
          <Route path="/cafeteira9" element={<Cafeteira9 />} /> {/* Rota para Cafeteira 9 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;