import React, { useEffect, useState } from "react";
import styles from "./cafeteira6.module.css";

import beep from "../../assets/beep.mp3";
import somCafePronto from "../../assets/somCafePronto.wav";
import somLimpar from "../../assets/somLimpar.wav";

const perfis = [
  { nome: "Padrão", temperatura: 90, tempo: 10 },
  { nome: "Forte", temperatura: 95, tempo: 12 },
  { nome: "Suave", temperatura: 85, tempo: 8 },
];

function Cafeteira6() {
  const [estado, setEstado] = useState("idle");
  const [perfilIndex, setPerfilIndex] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [agua, setAgua] = useState(100);
  const [borra, setBorra] = useState(0);
  const [modoAcessivel, setModoAcessivel] = useState(false);

  const perfilAtual = perfis[perfilIndex];
  const audioPronto = new Audio(somCafePronto);
  const audioErro = new Audio(beep);
  const audioLimpar = new Audio(somLimpar);

  useEffect(() => {
    let timer;
    if (estado === "preparando") {
      setProgresso(0);
      setTempoRestante(perfilAtual.tempo);
      timer = setInterval(() => {
        setProgresso((p) => {
          const novo = p + 10;
          if (novo >= 100) {
            clearInterval(timer);
            setEstado("pronto");
            setAgua((a) => Math.max(0, a - 20));
            setBorra((b) => Math.min(100, b + 20));
            audioPronto.play();
          }
          return novo;
        });
        setTempoRestante((t) => t - 1);
      }, (perfilAtual.tempo * 1000) / 10);
    }
    return () => clearInterval(timer);
  }, [estado, perfilAtual]);

  const iniciarPreparo = () => {
    if (estado === "idle" && agua >= 20 && borra <= 80) {
      setEstado("preparando");
    } else {
      audioErro.play();
      setEstado("erro");
    }
  };

  const limpar = () => {
    setAgua(100);
    setBorra(0);
    setEstado("idle");
    audioLimpar.play();
  };

  const resetar = () => {
    setEstado("idle");
    setProgresso(0);
    setTempoRestante(0);
  };

  return (
    <div className={`${styles.cafeteira} ${modoAcessivel ? styles.acessivel : ""}`}>
      <h2 className={styles.titulo}>☕ Cafeteira Inteligente 6.0</h2>

      <div className={styles.display}>
        <p>{estado === "preparando" ? "Preparando café..." : estado === "pronto" ? "☕ Café pronto!" : estado === "erro" ? "Erro! Verifique água ou borras." : "Selecione e prepare"}</p>
        {estado === "preparando" && (
          <>
            <p>Progresso: {progresso}%</p>
            <p>Tempo restante: {tempoRestante}s</p>
          </>
        )}
        <p>Temperatura: {perfilAtual.temperatura}°C</p>
        <p>Perfil: {perfilAtual.nome}</p>
        <div className={styles.perfis}>
          {perfis.map((p, i) => (
            <button key={i} onClick={() => setPerfilIndex(i)}>{p.nome}</button>
          ))}
        </div>
      </div>

      <div className={styles.botoes}>
        <button onClick={iniciarPreparo}>☕ Preparar</button>
        <button onClick={limpar}>🧼 Limpar</button>
        <button onClick={resetar}>🔁 Resetar</button>
        <button onClick={() => setModoAcessivel(!modoAcessivel)}>🧏 Acessível</button>
      </div>

      <div className={styles.niveis}>
        <p>Água: {agua}%</p>
        <div className={styles.barra}><div className={styles.agua} style={{ width: `${agua}%` }}></div></div>

        <p>Borras: {borra}%</p>
        <div className={styles.barra}><div className={styles.borra} style={{ width: `${borra}%` }}></div></div>
      </div>
    </div>
  );
}

export default Cafeteira6;
