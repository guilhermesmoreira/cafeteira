import React, { useState, useEffect } from "react";
import styles from "./cafeteira4.module.css";
import somCafePronto from "../../assets/somCafePronto.wav";
import somLimpar from "../../assets/somLimpar.wav";
import beep from "../../assets/beep.mp3";

function Cafeteira4() {
  const [temp, setTemp] = useState(90);
  const [unit, setUnit] = useState("C");
  const [tempo, setTempo] = useState(5);
  const [tempoRestante, setTempoRestante] = useState(5);
  const [agua, setAgua] = useState(70);
  const [cafe, setCafe] = useState(50);
  const [estado, setEstado] = useState("Stand-by");
  const [feedback, setFeedback] = useState(true);
  const [uso, setUso] = useState(0);
  const [cafePronto, setCafePronto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [isVibrating, setIsVibrating] = useState(false);

  const audioBeep = new Audio(beep);
  const audioVibra = new Audio(somLimpar);
  const audioErro = new Audio(beep);
  const audioCafePronto = new Audio(somCafePronto);

  const iniciar = () => {
    if (agua < 20 || cafe < 20) {
      audioErro.play();
      setMensagem("Erro: Pouca água ou pouco café.");
      setEstado("Stand-by");
      return;
    }

    if (uso > 0 && uso % 3 === 0) {
      setEstado("Necessário Limpeza");
      setMensagem("⚠️ Necessário realizar limpeza!");
      return;
    }

    setEstado("Aquecendo água");
    setMensagem("Aquecendo água...");
    tocarSom(audioBeep);

    setTimeout(() => {
      setEstado("Extraindo café");
      setMensagem("Extraindo café...");
      setTempoRestante(tempo);
    }, 1500);
  };

  useEffect(() => {
    if (estado !== "Extraindo café" || tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [estado, tempoRestante]);

  useEffect(() => {
    if (estado === "Extraindo café" && tempoRestante === 0) {
      setEstado("Com café");
      setMensagem("☕ Café Pronto!");
      setCafePronto(true);
      setUso((u) => u + 1);
      tocarSom(audioCafePronto);
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 500);
    }
  }, [estado, tempoRestante]);

  const tocarSom = (audio) => {
    if (!feedback) return;
    audio.currentTime = 0;
    audio.play();
  };

  const limpar = () => {
    setEstado("Stand-by");
    setMensagem("Máquina limpa com sucesso!");
    setUso(0);
    setCafePronto(false);
    tocarSom(audioVibra);
  };

  const servirCafe = () => {
    if (!cafePronto) return;
    setMensagem("☕ Café Servido!");
    setCafePronto(false);
  };

  const tempDisplay = unit === "C" ? `${temp}°C` : `${Math.round(temp * 9 / 5 + 32)}°F`;

  return (
    <div className={`${styles.cafeteira} ${isVibrating ? styles.vibrateEffect : ""}`}>
      <h2 className="text-xl font-bold">Cafeteira 4</h2>

      {mensagem && <div className={styles.mensagem}>{mensagem}</div>}

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
              style={{ transform: `rotate(${tempoRestante * 6}deg)` }}
            />
            <div className={styles.numeroTempo}>{tempoRestante}s</div>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="60"
          value={tempo}
          onChange={(e) => {
            const novoTempo = Number(e.target.value);
            setTempo(novoTempo);
            setTempoRestante(novoTempo);
          }}
        />
      </div>

      <div className={styles.botoes}>
        <button onClick={iniciar}>Iniciar</button>
        <button onClick={limpar}>Limpar</button>
      </div>

      {/* Alavanca */}
      <div
        className={`${styles.alavanca} ${!cafePronto ? styles.desativado : ""}`}
        onClick={servirCafe}
      >
        <div className={styles.tracoHorizontal}></div>
        <div className={styles.tracoVertical}></div>
      </div>

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
    </div>
  );
}

export default Cafeteira4;
