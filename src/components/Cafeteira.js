import React, { useState, useEffect } from 'react';
import style from './Cafeteira.module.css'; 

const Cafeteira = () => {
  const [agua, setAgua] = useState(0);
  const [ligada, setLigada] = useState(false);

  useEffect(() => {
    let intervalo;
    if (ligada && agua < 100) {
      intervalo = setInterval(() => {
        setAgua((prevAgua) => prevAgua + 1);
      }, 100);
    } else if (agua >= 100) {
      setLigada(false);
    }
    return () => clearInterval(intervalo);
  }, [ligada, agua]);

  const ligarDesligar = () => {
    setLigada(!ligada);
    if (agua >= 100) {
      setAgua(0);
    }
  };

  const limpar = () => {
    setAgua(0);
    setLigada(false);
  };

  return (
    <div className={style.cafeteira}>
      <div className={style.base}>
        <div className={style.barraAgua} style={{ height: `${agua}%` }}></div>
      </div>
      <div className={style.corpo}>
        <div className={style.botoes}>
          <div className={style.botaoLimpar} onClick={limpar}>
            Limpar
          </div>
          <button className={style.botaoLigar} onClick={ligarDesligar}>
            {ligada ? 'Desligar' : 'Ligar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cafeteira;