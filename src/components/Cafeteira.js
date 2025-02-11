import React, { useState, useEffect } from 'react';
import style from './Cafeteira.module.css'; // Importando o CSS Module

const Cafeteira = () => {
  const [agua, setAgua] = useState(0);
  const [cafe, setCafe] = useState(0); // Estado para controlar o nível de café
  const [ligada, setLigada] = useState(false);
  const [preenchendoAgua, setPreenchendoAgua] = useState(false); // Estado para controlar o preenchimento da água
  const [preenchendoCafe, setPreenchendoCafe] = useState(false); // Estado para controlar o preenchimento do café
  const [cafePronto, setCafePronto] = useState(false); // Estado para controlar a mensagem "Café pronto!"

  // Lógica de preenchimento automático da água
  useEffect(() => {
    let intervalo;
    if (preenchendoAgua && agua < 100) {
      intervalo = setInterval(() => {
        setAgua((prevAgua) => prevAgua + 1); // Incrementa a água automaticamente
      }, 100); // A cada 100ms (0.1s)
    } else if (agua >= 100) {
      setPreenchendoAgua(false); // Para o preenchimento ao atingir 100%
    }
    return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar o componente
  }, [preenchendoAgua, agua]);

  // Lógica de preenchimento automático do café
  useEffect(() => {
    let intervalo;
    if (preenchendoCafe && cafe < 100) {
      intervalo = setInterval(() => {
        setCafe((prevCafe) => prevCafe + 1); // Incrementa o café automaticamente
      }, 100); // A cada 100ms (0.1s)
    } else if (cafe >= 100) {
      setPreenchendoCafe(false); // Para o preenchimento ao atingir 100%
    }
    return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar o componente
  }, [preenchendoCafe, cafe]);

  const ligarDesligar = () => {
    setLigada(!ligada);
    if (agua >= 100) {
      setAgua(0);
    }
    if (cafe >= 100) {
      setCafe(0);
    }
    setCafePronto(false); // Reseta a mensagem "Café pronto!" ao desligar
  };

  const limpar = () => {
    if (ligada) {
      setAgua(0);
      setCafe(0);
      setPreenchendoAgua(false);
      setPreenchendoCafe(false);
      setCafePronto(false); // Reseta a mensagem "Café pronto!" ao limpar
    }
  };

  const adicionarAgua = () => {
    if (ligada) {
      setPreenchendoAgua(!preenchendoAgua); // Pausa/continua o preenchimento da água
    }
  };

  const adicionarCafe = () => {
    if (ligada) {
      setPreenchendoCafe(!preenchendoCafe); // Pausa/continua o preenchimento do café
    }
  };

  const prepararCafe = () => {
    if (ligada && agua > 0 && cafe > 0) {
      setCafePronto(true); // Exibe a mensagem "Café pronto!"
    }
  };

  return (
    <div className={style.cafeteira}>
      {/* Container do café */}
      <div className={style.containerCafe}>
        <div className={style.barraCafe} style={{ height: `${cafe}%` }}>
          <span className={style.porcentagem}>{cafe}%</span>
        </div>
      </div>
      {cafePronto && <div className={style.mensagem}>Café pronto!</div>}

      <div className={style.base}>
        <div
          className={`${style.barraAgua} ${cafePronto ? style.barraCafePronto : ''}`}
          style={{ height: `${agua}%` }}
        >
          <span className={style.porcentagem}>{agua}%</span>
        </div>
      </div>
      <div className={style.corpo}>
        <div className={style.botoes}>
          <div
            className={`${style.botaoLimpar} ${!ligada ? style.desativado : ''}`}
            onClick={limpar}
          >
            Limpar
          </div>
          <div
            className={`${style.botaoAgua} ${!ligada ? style.desativado : ''}`}
            onClick={adicionarAgua}
          >
            {preenchendoAgua ? 'Pausar' : 'Água'}
          </div>
          <div
            className={`${style.botaoCafe} ${!ligada ? style.desativado : ''}`}
            onClick={adicionarCafe}
          >
            {preenchendoCafe ? 'Pausar' : 'Café'}
          </div>
          <div
            className={`${style.botaoPreparar} ${!ligada ? style.desativado : ''}`}
            onClick={prepararCafe}
          >
            Preparar Café
          </div>
        </div>
      </div>
      <button
        className={`${style.botaoLigar} ${ligada ? style.ligado : ''}`}
        onClick={ligarDesligar}
      >
        {ligada ? 'ON' : 'OFF'}
      </button>
    </div>
  );
};

export default Cafeteira;