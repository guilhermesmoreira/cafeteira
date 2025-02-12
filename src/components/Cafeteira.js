import React, { useState, useEffect } from "react";
import style from "./Cafeteira.module.css"; // Importando o CSS Module

const Cafeteira = () => {
  const [agua, setAgua] = useState(0);
  const [cafe, setCafe] = useState(0); // Estado para controlar o nível de café
  const [ligada, setLigada] = useState(false);
  const [preenchendoAgua, setPreenchendoAgua] = useState(false); // Estado para controlar o preenchimento da água
  const [preenchendoCafe, setPreenchendoCafe] = useState(false); // Estado para controlar o preenchimento do café
  const [cafePronto, setCafePronto] = useState(false); // Estado para controlar a mensagem "Café pronto!"
  const [corAgua, setCorAgua] = useState("#00bfff"); // Estado para controlar a cor da água
  const [mensagem, setMensagem] = useState(""); // Estado para controlar a mensagem
  const [cafeServido, setCafeServido] = useState(false);

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

  // Lógica para mudança de cor da água e mensagem
  useEffect(() => {
    if (cafePronto) {
      setMensagem("Preparando Café..."); // Mensagem durante a transição

      const inicio = Date.now(); // Tempo inicial
      const duracao = 4000; // Duração da transição em milissegundos (4 segundos)

      const intervalo = setInterval(() => {
        const tempoDecorrido = Date.now() - inicio; // Tempo decorrido desde o início
        const progresso = Math.min(tempoDecorrido / duracao, 1); // Progresso de 0 a 1

        // Interpolação entre azul (#00bfff) e marrom (#8b4513)
        const azul = [0, 191, 255];
        const marrom = [139, 69, 19];
        const novaCor = azul.map((valor, index) =>
          Math.round(valor + (marrom[index] - valor) * progresso)
        );
        setCorAgua(`rgb(${novaCor.join(",")})`);

        // Finaliza a transição após 4 segundos
        if (progresso >= 1) {
          clearInterval(intervalo);
          setMensagem("Café Pronto!"); // Mensagem final
        }
      }, 50); // Atualiza a cor a cada 50ms

      return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar o componente
    } else {
      setCorAgua("#00bfff"); // Volta para azul se o café não estiver pronto
      setMensagem(""); // Limpa a mensagem
    }
  }, [cafePronto]);

  const ligarDesligar = () => {
    if (ligada) {
      if (agua === 0 && cafe === 0) {
        setLigada(false);
        setCafePronto(false); // Reseta a mensagem "Café pronto!" ao desligar
      } else {
        setMensagem("Limpe a máquina antes de desligar!");
      }
    } else {
      setLigada(true);
    }
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
    if (ligada && agua === 100 && cafe === 100) {
      setCafePronto(true); // Inicia a preparação do café
    }
  };

  const servirCafe = () => {
    if (!cafePronto) return; // Impede a ação caso o café não esteja pronto
  
    setCafeServido(true);
    setMensagem('Café Servido!');
  };

  return (
    <div className={style.cafeteira}>
      {/* Container do café */}
      <div className={style.containerCafe}>
        <div className={style.barraCafe} style={{ height: `${cafe}%` }}>
          <span className={style.porcentagem}>{cafe}%</span>
        </div>
      </div>
      {mensagem && <div className={style.mensagem}>{mensagem}</div>}

      <div className={style.base}>
        <div
          className={style.barraAgua}
          style={{ height: `${agua}%`, backgroundColor: corAgua }}
        >
          <span className={style.porcentagem}>{agua}%</span>
        </div>
      </div>
      <div className={style.corpo}>
        <div className={style.botoes}>
          <div className={style.botoesSuperiores}>
            <div
              className={`${style.botaoAgua} ${
                !ligada ? style.desativado : ""
              }`}
              onClick={adicionarAgua}
            >
              {preenchendoAgua ? "Pausar" : "Água"}
            </div>
            <div
              className={`${style.botaoCafe} ${
                !ligada ? style.desativado : ""
              }`}
              onClick={adicionarCafe}
            >
              {preenchendoCafe ? "Pausar" : "Café"}
            </div>
          </div>
          <div
            className={`${style.botaoPreparar} ${
              !ligada || agua < 100 || cafe < 100 ? style.desativado : ""
            }`}
            onClick={prepararCafe}
          >
            Preparar Café
          </div>
          <div
            className={`${style.alavanca} ${
              !cafePronto ? style.desativado : ""
            }`}
            onClick={servirCafe}
          >
            <div className={style.tracoHorizontal}></div>
            <div className={style.tracoVertical}></div>
          </div>
        </div>
        <div
          className={`${style.botaoLimpar} ${!ligada ? style.desativado : ""}`}
          onClick={limpar}
        >
          Limpar
        </div>
      </div>
      <button
        className={`${style.botaoLigar} ${ligada ? style.ligado : ""}`}
        onClick={ligarDesligar}
      >
        {ligada ? "ON" : "OFF"}
      </button>
    </div>
  );
};

export default Cafeteira;
