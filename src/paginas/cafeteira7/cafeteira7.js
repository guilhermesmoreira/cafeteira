import React, { useState, useEffect } from "react";
import styles from "./cafeteira7.module.css";

// Importação dos arquivos de áudio
import beep from "../../assets/beep.mp3";
import somCafePronto from "../../assets/somCafePronto.wav";
import somLimpar from "../../assets/somLimpar.wav";

// Configurações globais da cafeteira
const CONFIG = {
  INTERVALOS: 10, // Quantidade de intervalos para a barra de progresso
  TEMPOS_PREPARO: {
    fraco: 8, // Tempo em segundos para café fraco
    medio: 10, // Tempo em segundos para café médio
    forte: 12, // Tempo em segundos para café forte
  },
  TEMPO_LIMPEZA: 10, // Tempo em segundos para limpeza
};

// Componente principal da cafeteira virtual
function Cafeteira7() {
  // Estados para gerenciar o status da cafeteira, progresso, tempo restante e intensidade
  const [statusDaCafeteira, setStatusDaCafeteira] = useState("idle");
  const [progressoPreparo, setProgressoPreparo] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [intensidadeCafe, setIntensidadeCafe] = useState("medio"); // Intensidade padrão: médio

  // Instâncias de áudio para feedback sonoro
  const audioCafePronto = new Audio(somCafePronto);
  const audioLimpeza = new Audio(somLimpar);
  const audioErro = new Audio(beep);

  // Textos exibidos no display para cada estado
  const mensagensDisplay = {
    idle: "Aguardando comando...",
    preparando: `Preparando café ${intensidadeCafe}...`,
    pronto: "☕ Café pronto! Aproveite!",
    limpando: "Limpando o sistema...",
    erro: "Erro! Por favor, reinicie a cafeteira.",
  };

  // Função auxiliar para tocar som de erro e definir estado de erro
  const dispararErro = () => {
    audioErro.play();
    setStatusDaCafeteira("erro");
  };

  // Função para iniciar o preparo do café
  const handleIniciarPreparo = () => {
    if (statusDaCafeteira === "idle" || statusDaCafeteira === "pronto") {
      setStatusDaCafeteira("preparando");
    } else {
      dispararErro();
    }
  };

  // Função para iniciar o processo de limpeza
  const handleIniciarLimpeza = () => {
    if (statusDaCafeteira === "idle" || statusDaCafeteira === "pronto") {
      setStatusDaCafeteira("limpando");
      audioLimpeza.play();
    } else {
      dispararErro();
    }
  };

  // Função para resetar a cafeteira
  const handleResetar = () => {
    setStatusDaCafeteira("idle");
    setProgressoPreparo(0);
    setSegundosRestantes(0);
    setIntensidadeCafe("medio"); // Reseta para intensidade padrão
  };

  // Função para atualizar a intensidade do café
  const handleMudarIntensidade = (event) => {
    setIntensidadeCafe(event.target.value);
  };

  // Efeito para gerenciar o temporizador de preparo ou limpeza
  useEffect(() => {
    let temporizador;

    if (statusDaCafeteira === "preparando" || statusDaCafeteira === "limpando") {
      // Define o tempo total com base no estado
      const tempoTotal = statusDaCafeteira === "preparando" 
        ? CONFIG.TEMPOS_PREPARO[intensidadeCafe] 
        : CONFIG.TEMPO_LIMPEZA;

      // Inicializa progresso e tempo restante
      setProgressoPreparo(0);
      setSegundosRestantes(tempoTotal);

      // Calcula o intervalo de atualização (em milissegundos)
      const intervaloMs = (tempoTotal * 1000) / CONFIG.INTERVALOS;

      temporizador = setInterval(() => {
        setProgressoPreparo((progressoAtual) => {
          const novoProgresso = progressoAtual + (100 / CONFIG.INTERVALOS);
          if (novoProgresso >= 100) {
            clearInterval(temporizador);
            setStatusDaCafeteira("pronto");
            if (statusDaCafeteira === "preparando") {
              audioCafePronto.play();
            }
            return 100;
          }
          return novoProgresso;
        });

        setSegundosRestantes((segundos) => Math.max(0, segundos - 1));
      }, intervaloMs);
    }

    // Limpeza do temporizador ao desmontar o componente ou mudar o estado
    return () => clearInterval(temporizador);
  }, [statusDaCafeteira, intensidadeCafe]);

  // Determina a classe CSS do indicador com base no status
  const classeIndicador = () => {
    switch (statusDaCafeteira) {
      case "erro":
        return styles.indicadorVermelho;
      case "preparando":
      case "limpando":
        return styles.indicadorAzul;
      case "pronto":
        return styles.indicadorVerde;
      default:
        return "";
    }
  };

  return (
    <div className={styles.cafeteira}>
      {/* Display da cafeteira */}
      <div className={styles.display}>
        <p>{mensagensDisplay[statusDaCafeteira]}</p>
        {(statusDaCafeteira === "preparando" || statusDaCafeteira === "limpando") && (
          <div className={styles.infoProgresso}>
            <p>Progresso: {Math.round(progressoPreparo)}%</p>
            <p>Tempo restante: {segundosRestantes}s</p>
          </div>
        )}
      </div>

      {/* Seletor de intensidade do café */}
      <div className={styles.seletorIntensidade}>
        <label htmlFor="intensidade-cafe">Intensidade do café:</label>
        <select
          id="intensidade-cafe"
          value={intensidadeCafe}
          onChange={handleMudarIntensidade}
          disabled={statusDaCafeteira === "preparando" || statusDaCafeteira === "limpando"}
          aria-label="Selecionar intensidade do café"
        >
          <option value="fraco">Fraco</option>
          <option value="medio">Médio</option>
          <option value="forte">Forte</option>
        </select>
      </div>

      {/* Botões de controle */}
      <div className={styles.botoes}>
        <button
          onClick={handleIniciarPreparo}
          aria-label="Iniciar preparo do café"
        >
          ☕ Preparar Café
        </button>
        <button
          onClick={handleIniciarLimpeza}
          aria-label="Iniciar limpeza do sistema"
        >
          🧼 Limpar
        </button>
        <button
          onClick={handleResetar}
          aria-label="Resetar cafeteira"
        >
          🔁 Resetar
        </button>
      </div>

      {/* Indicador visual de status */}
      <div className={styles.indicadores}>
        <div
          className={`${styles.indicador} ${classeIndicador()}`}
          role="status"
          aria-label={`Status: ${statusDaCafeteira}`}
        ></div>
      </div>
    </div>
  );
}

export default Cafeteira7;