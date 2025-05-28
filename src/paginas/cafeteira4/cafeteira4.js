//Cafeteira somente eu.

import React, { useState } from "react";
import styles from "./cafeteira4.module.css";
import beep from "../../assets/beep.mp3";
import somCafePronto from "../../assets/somCafePronto.wav";
import somLimpar from "../../assets/somLimpar.wav";

function Cafeteira4() {
  const [temp, setTemp] = useState(90);
  const [unit, setUnit] = useState("C");
  const [tempo, setTempo] = useState(5);
  const [agua, setAgua] = useState(70);
  const [cafe, setCafe] = useState(50);
  const [estado, setEstado] = useState("Stand-by");
  const [configOpen, setConfigOpen] = useState(false);
  const [feedback, setFeedback] = useState(true);
  const [uso, setUso] = useState(0); // Adicionando o estado 'uso'

  const audioBeep = new Audio(beep);
  const audioVibra = new Audio(somLimpar);
  const audioErro = new Audio(beep);
  const audioCafePronto = new Audio(somCafePronto);

  const playFeedback = () => {
    if (feedback) {
      audioBeep.play();
      setTimeout(() => audioVibra.play(), 100);
    }
  };

  const iniciar = () => {
    if (agua < 20 || cafe < 20) {
      audioErro.play();
      alert("Erro: Pouca água ou pouco café.");
      setEstado("Stand-by");
      return;
    }

    if (uso > 0 && uso % 3 === 0) {
      setEstado("Necessário Limpeza");
      alert("⚠️ Necessário realizar limpeza!");
      return;
    }

    setEstado("Aquecendo água");
    playFeedback();

    setTimeout(() => {
      setEstado("Extraindo café");
    }, 1500);

    setTimeout(() => {
      setEstado("Com café");
      setUso((u) => u + 1); // Atualizando o estado 'uso'
      audioCafePronto.play();
    }, 5000);
  };

  const tempDisplay = unit === "C" ? `${temp}°C` : `${Math.round(temp * 9 / 5 + 32)}°F`;

  return (
    <div className={styles.cafeteira}>
      <h2 className={styles.titulo}>Cafeteira Touch 4</h2>

      <div className={styles.temperatura}>
        <button onClick={() => setTemp(temp - 1)}>-</button>
        <div className={styles.valorGrande}>{tempDisplay}</div>
        <button onClick={() => setTemp(temp + 1)}>+</button>
        <div className={styles.chave}>
          <label>
            <input
              type="checkbox"
              checked={unit === "F"}
              onChange={() => setUnit(unit === "C" ? "F" : "C")}
            />
            {unit === "C" ? "°C" : "°F"}
          </label>
        </div>
      </div>

      <div className={styles.tempo}>
        <div className={styles.relogio}>
          <div className={styles.circulo}>
            <div
              className={styles.ponteiro}
              style={{ transform: `rotate(${tempo * 6}deg)` }}
            />
            <div className={styles.numeroTempo}>{tempo}s</div>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="60"
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
        />
      </div>

      <div className={styles.sliders}>
        <div>
          <div className={styles.valorVertical}>{agua}%</div>
          <input
            type="range"
            min="0"
            max="100"
            value={agua}
            onChange={(e) => setAgua(Number(e.target.value))}
            className={styles.sliderVertical}
          />
          <p>Água</p>
        </div>
        <div>
          <div className={styles.valorVertical}>{cafe}%</div>
          <input
            type="range"
            min="0"
            max="100"
            value={cafe}
            onChange={(e) => setCafe(Number(e.target.value))}
            className={styles.sliderVertical}
          />
          <p>Café</p>
        </div>
      </div>

      <div className={styles.estado}>{estado}</div>

      <div className={styles.botoes}>
        <button onClick={iniciar}>Iniciar</button>
        <button onClick={() => setConfigOpen(!configOpen)}>Configurar</button>
        <button
          onClick={() => {
            setEstado("Stand-by");
            setUso(0); // Resetando o estado 'uso'
            alert("Máquina limpa com sucesso!");
            audioVibra.play();
          }}
        >
          Limpar
        </button>
      </div>

      {configOpen && (
        <div className={styles.config}>
          <label>
            <input
              type="checkbox"
              checked={feedback}
              onChange={(e) => setFeedback(e.target.checked)}
            />
            Feedback sonoro/tátil
          </label>
        </div>
      )}
    </div>
  );
}

export default Cafeteira4;