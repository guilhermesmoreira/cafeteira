import React, { useEffect, useState } from "react";
import styles from "./cafeteira8.module.css";

import beep from "../../assets/beep.mp3";
import somCafePronto from "../../assets/somCafePronto.wav";
import somManutencao from "../../assets/somLimpar.wav";

function Cafeteira8() {
  const [estado, setEstado] = useState("idle");
  const [progresso, setProgresso] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [temperatura, setTemperatura] = useState(90);
  const [agua, setAgua] = useState(0);
  const [borra, setBorra] = useState(0);
  const [uso, setUso] = useState(0);
  const [cafeDisponivel, setCafeDisponivel] = useState(0);

  const tempoTotal = 10;
  const audioPronto = new Audio(somCafePronto);
  const audioAlerta = new Audio(beep);
  const audioManutencao = new Audio(somManutencao);

  useEffect(() => {
    let timer;
    if (estado === "preparando") {
      setProgresso(0);
      setTempoRestante(tempoTotal);
      timer = setInterval(() => {
        setProgresso((p) => {
          const novo = p + 10;
          if (novo >= 100) {
            clearInterval(timer);
            setEstado("pronto");
            setAgua((a) => Math.max(0, a - 20));
            setBorra((b) => Math.min(100, b + 20));
            setUso((u) => u + 1);
            setCafeDisponivel(100);
            audioPronto.play();
          }
          return novo;
        });
        setTempoRestante((t) => t - 1);
      }, (tempoTotal * 1000) / 10);
    }
    return () => clearInterval(timer);
  }, [estado]);

  useEffect(() => {
    if (uso > 0 && uso % 3 === 0) {
      audioManutencao.play();
    }
  }, [uso]);

  const iniciarPreparo = () => {
    if (estado === "idle" && agua >= 20 && borra <= 80) {
      setEstado("preparando");
    } else {
      setEstado("erro");
      audioAlerta.play();
    }
  };

  const resetar = () => {
    setEstado("idle");
    setProgresso(0);
    setTempoRestante(0);
  };

  const limpar = () => {
    setBorra(0);
    setAgua(0);
    setCafeDisponivel(0);
    audioManutencao.play();
    setEstado("idle");
  };

  const adicionarAgua = () => setAgua((a) => Math.min(100, a + 10));
  const adicionarCafe = () => setBorra((b) => Math.min(100, b + 10));

  const servirCafe = () => {
    if (cafeDisponivel <= 0) return;
    setCafeDisponivel((c) => Math.max(0, c - 25));
  };

  return (
    <div className={styles.cafeteira}>
      <h2 className={styles.titulo}>Cafeteira Touch 8.0</h2>

      <div className={styles.display}>
        <p>
          {estado === "preparando"
            ? "Preparando café..."
            : estado === "pronto"
            ? "☕ Café pronto!"
            : estado === "erro"
            ? "Erro! Verifique níveis ou reinicie."
            : "Toque para começar"}
        </p>
        {estado === "preparando" && (
          <>
            <p>Progresso: {progresso}%</p>
            <p>Tempo restante: {tempoRestante}s</p>
          </>
        )}
        <p>Temperatura: {temperatura}°C</p>
        <input
          type="range"
          min="70"
          max="100"
          value={temperatura}
          onChange={(e) => setTemperatura(e.target.value)}
        />
      </div>

      <div className={styles.botoes}>
        <button onClick={iniciarPreparo}>☕ Iniciar</button>
        <button onClick={resetar}>🔁 Resetar</button>
        <button onClick={limpar}>🧼 Limpar</button>
      </div>

      <div className={styles.niveis}>
        <div className={styles.nivelItem}>
          <p>Água: {agua}%</p>
          <div className={styles.barra}>
            <div className={styles.agua} style={{ width: `${agua}%` }}></div>
          </div>
          <button onClick={adicionarAgua}>+ Água</button>
        </div>

        <div className={styles.nivelItem}>
          <p>Café (borras): {borra}%</p>
          <div className={styles.barra}>
            <div className={styles.borra} style={{ width: `${borra}%` }}></div>
          </div>
          <button onClick={adicionarCafe}>+ Café</button>
        </div>

        <div className={styles.nivelItem}>
          <p>Café Pronto: {cafeDisponivel}%</p>
          <div className={styles.barra}>
            <div
              className={styles.cafePronto}
              style={{ width: `${cafeDisponivel}%` }}
            ></div>
          </div>
          <button onClick={servirCafe}>☕ Servir Café</button>
        </div>
      </div>

      {uso > 0 && uso % 3 === 0 && (
        <div className={styles.alerta}>🔧 Recomendado realizar limpeza!</div>
      )}
    </div>
  );
}

export default Cafeteira8;
