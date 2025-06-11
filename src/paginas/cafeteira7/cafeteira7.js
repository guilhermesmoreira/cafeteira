import React, { useState, useEffect } from "react";
import styles from "./cafeteira7.module.css";

import beep from "../../assets/beep.mp3";
import somCafePronto from "../../assets/somCafePronto.wav";
import somLimpar from "../../assets/somLimpar.wav";

const CONFIG = {
  INTERVALOS: 10,
  TEMPOS_PREPARO: {
    fraco: 8,
    medio: 10,
    forte: 12,
  },
  TEMPO_LIMPEZA: 10,
};

function Cafeteira7() {
  const [statusDaCafeteira, setStatusDaCafeteira] = useState("idle");
  const [progressoPreparo, setProgressoPreparo] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [intensidadeCafe, setIntensidadeCafe] = useState("medio");
  const [cafePronto, setCafePronto] = useState(false);
  const [mensagemCafe, setMensagemCafe] = useState("");
  const [nivelAgua, setNivelAgua] = useState(0);
  const [nivelCafe, setNivelCafe] = useState(0);
  const [progressoCafePronto, setProgressoCafePronto] = useState(0);



  const audioCafePronto = new Audio(somCafePronto);
  const audioLimpeza = new Audio(somLimpar);
  const audioErro = new Audio(beep);

  const mensagensDisplay = {
    idle: "Aguardando comando...",
    preparando: `Preparando café ${intensidadeCafe}...`,
    pronto: "☕ Café pronto! Aproveite!",
    limpando: "Limpando o sistema...",
    erro: "Erro! Por favor, reinicie a cafeteira.",
  };

  const dispararErro = () => {
    audioErro.play();
    setStatusDaCafeteira("erro");
  };

  const preencherNivel = (tipo) => {
    let setFunc = tipo === "agua" ? setNivelAgua : setNivelCafe;
    let valorAtual = tipo === "agua" ? nivelAgua : nivelCafe;

    if (valorAtual >= 100) return;

    const intervalo = setInterval(() => {
      setFunc((prev) => {
        const novo = prev + 1;
        if (novo >= 100) {
          clearInterval(intervalo);
          return 100;
        }
        return novo;
      });
    }, 30);
  };


  const handleIniciarPreparo = () => {
    if (statusDaCafeteira === "idle" || statusDaCafeteira === "pronto") {
      setStatusDaCafeteira("preparando");
      setMensagemCafe("");
    } else {
      dispararErro();
    }
  };

  const handleIniciarLimpeza = () => {
    if (statusDaCafeteira === "idle" || statusDaCafeteira === "pronto") {
      setStatusDaCafeteira("limpando");
      setMensagemCafe("");
      audioLimpeza.play();
    } else {
      dispararErro();
    }
  };

  const handleResetar = () => {
    setStatusDaCafeteira("idle");
    setProgressoPreparo(0);
    setSegundosRestantes(0);
    setIntensidadeCafe("medio");
    setMensagemCafe("");
    setCafePronto(false);
  };

  const handleMudarIntensidade = (event) => {
    setIntensidadeCafe(event.target.value);
  };

  useEffect(() => {
    let temporizador;

    if (statusDaCafeteira === "preparando" || statusDaCafeteira === "limpando") {
      const tempoTotal = statusDaCafeteira === "preparando"
        ? CONFIG.TEMPOS_PREPARO[intensidadeCafe]
        : CONFIG.TEMPO_LIMPEZA;

      setProgressoPreparo(0);
      setSegundosRestantes(tempoTotal);

      const intervaloMs = (tempoTotal * 1000) / CONFIG.INTERVALOS;

      temporizador = setInterval(() => {
        setProgressoPreparo((progressoAtual) => {
          const novoProgresso = progressoAtual + (100 / CONFIG.INTERVALOS);
          if (novoProgresso >= 100) {
            clearInterval(temporizador);
            setStatusDaCafeteira("pronto");
            if (statusDaCafeteira === "preparando") {
              audioCafePronto.play();
              setCafePronto(true);
              setMensagemCafe("☕ Café Pronto!");
              setProgressoCafePronto(100); // Aqui adicionamos isso
            }
            return 100;
          }
          return novoProgresso;
        });

        setSegundosRestantes((segundos) => Math.max(0, segundos - 1));
      }, intervaloMs);
    }

    return () => clearInterval(temporizador);
  }, [statusDaCafeteira, intensidadeCafe]);

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

  const servirCafe = () => {
    if (!cafePronto || progressoCafePronto === 0) return;

    const novoProgresso = progressoCafePronto - 25;
    setProgressoCafePronto(Math.max(0, novoProgresso));
    setMensagemCafe("☕ Café Servido!");

    if (novoProgresso <= 0) {
      setCafePronto(false);
    }
  };


  return (
    <>
      <h2 className="text-xl font-bold">Cafeteira 7</h2>
      <div className={styles.cafeteira}>
        <div className={styles.display}>
          <p>{mensagensDisplay[statusDaCafeteira]}</p>
          {(statusDaCafeteira === "preparando" || statusDaCafeteira === "limpando") && (
            <div className={styles.infoProgresso}>
              <p>Progresso: {Math.round(progressoPreparo)}%</p>
              <p>Tempo restante: {segundosRestantes}s</p>
            </div>
          )}
        </div>

        {mensagemCafe && <div className={styles.mensagem}>{mensagemCafe}</div>}

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

        <div className={styles.barrasHorizontais}>
          <div className={styles.barraContainer}>
            <div className={styles.barraRotulo}>Água</div>
            <div className={styles.barraNivel}>
              <div
                className={styles.preenchimento}
                style={{ width: `${nivelAgua}%`, backgroundColor: "#00f" }}
              ></div>
            </div>
            <button onClick={() => preencherNivel("agua")}>Adicionar Água</button>
          </div>

          <div className={styles.barraContainer}>
            <div className={styles.barraRotulo}>Café</div>
            <div className={styles.barraNivel}>
              <div
                className={styles.preenchimento}
                style={{ width: `${nivelCafe}%`, backgroundColor: "#6f4e37" }}
              ></div>
            </div>
            <button onClick={() => preencherNivel("cafe")}>Adicionar Café</button>
          </div>
        </div>


        <div className={styles.botoes}>
          <button onClick={handleIniciarPreparo} aria-label="Iniciar preparo do café">☕ Preparar Café</button>
          <button onClick={handleIniciarLimpeza} aria-label="Iniciar limpeza do sistema">🧼 Limpar</button>
          <button onClick={handleResetar} aria-label="Resetar cafeteira">🔁 Resetar</button>
        </div>
        
          <div className={styles.barraCafePronto}>
            <div
              className={styles.preenchimentoCafe}
              style={{ width: `${progressoCafePronto}%` }}
            ></div>
          </div>
        <div className={`${styles.alavanca} ${!cafePronto ? styles.desativado : ""}`} onClick={servirCafe}>
          <div className={styles.tracoHorizontal}></div>
          <div className={styles.tracoVertical}></div>
        </div>

        <div className={styles.indicadores}>
          <div className={`${styles.indicador} ${classeIndicador()}`} role="status" aria-label={`Status: ${statusDaCafeteira}`}></div>
        </div>
      </div>
    </>
  );
}

export default Cafeteira7;
