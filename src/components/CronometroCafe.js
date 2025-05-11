import React, { useEffect, useState } from "react";
import styles from "./CronometroCafe.module.css";

const CronometroCafe = ({ tempoTotal }) => {
  const [segundosRestantes, setSegundosRestantes] = useState(tempoTotal);

  useEffect(() => {
    setSegundosRestantes(tempoTotal);
    if (tempoTotal <= 0) return;

    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tempoTotal]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  const anguloMinuto = (360 * minutos) / 60;
  const anguloSegundo = (360 * segundos) / 60;

  return (
    <div className={styles.cronometroContainer}>
      <div className={styles.relogio}>
        <div className={styles.ponteiroMinuto} style={{ transform: `rotate(${anguloMinuto}deg)` }} />
        <div className={styles.ponteiroSegundo} style={{ transform: `rotate(${anguloSegundo}deg)` }} />
        <div className={styles.numeroCentral}>
          {segundosRestantes}s
        </div>
        <div className={styles.marcadores}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={styles.marcador} style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CronometroCafe;
