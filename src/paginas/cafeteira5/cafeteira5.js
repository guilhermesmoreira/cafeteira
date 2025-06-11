import React, { useState, useEffect } from "react";
import styles from "./cafeteira5.module.css";

import somClique from "../../assets/beep.mp3";
import somErro from "../../assets/somLimpar.wav";
import somPronto from "../../assets/somCafePronto.wav";

function Cafeteira5() {
  const [temperatura, setTemperatura] = useState(92);
  const [tempo, setTempo] = useState(5);
  const [extraindo, setExtraindo] = useState(false);
  const [cronometro, setCronometro] = useState(0);
  const [status, setStatus] = useState("Pronto");
  const [volume, setVolume] = useState(100);
  const [alertaLimpeza, setAlertaLimpeza] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [somAtivo, setSomAtivo] = useState(true);
  const [vibrar, setVibrar] = useState(true);
  const [modalTempoAberto, setModalTempoAberto] = useState(false);
  const [agua, setAgua] = useState(0);
  const [cafe, setCafe] = useState(0);
  const [cafePronto, setCafePronto] = useState(0);
  const [torneiraUsos, setTorneiraUsos] = useState(0);
  const [mensagem, setMensagem] = useState("");

  const audioClique = new Audio(somClique);
  const audioErro = new Audio(somErro);
  const audioPronto = new Audio(somPronto);

  const tocarSom = (tipo) => {
    if (!somAtivo) return;
    if (tipo === "clique") audioClique.play();
    if (tipo === "erro") audioErro.play();
    if (tipo === "pronto") audioPronto.play();
  };

  const iniciarPreparo = () => {
    if (extraindo) return;
    if (agua < 50 || cafe < 50 || volume < 50) {
      setMostrarPopup(true);
      tocarSom("erro");
      return;
    }

    setStatus("Aquecendo");
    setTimeout(() => {
      setStatus("Extraindo");
      setExtraindo(true);
      setCronometro(tempo);
      setTorneiraUsos(0);
      setCafePronto(0);
      tocarSom("clique");
    }, 1000);
  };

  useEffect(() => {
    if (!extraindo) return;
    if (cronometro === 0) {
      setStatus("Pronto");
      setExtraindo(false);
      setAlertaLimpeza(true);
      tocarSom("pronto");
      return;
    }
    const timer = setTimeout(() => {
      setCronometro((prev) => prev - 1);
      setCafePronto((prev) => Math.min(100, prev + 100 / tempo));
    }, 1000);
    return () => clearTimeout(timer);
  }, [cronometro, extraindo]);

  const adicionarAgua = () => {
    setAgua(100);
  };

  const adicionarCafe = () => {
    setCafe(100);
  };

  const servirCafe = () => {
    if (cafePronto < 25 || torneiraUsos >= 4) return;
    setCafePronto((prev) => Math.max(0, prev - 25));
    setTorneiraUsos((prev) => prev + 1);
    setMensagem("Café servido!");
    setTimeout(() => setMensagem(""), 2000);
  };

  return (
    <>
      <h2 className="text-xl font-bold">Cafeteira 5</h2>
      <div className={styles.cafeteira}>
        <div className={styles.topBar}>
          <span className={styles.statusIcon}>🔋</span>
          <span>{status}</span>
        </div>

        <div className={styles.statusArea}>
          <span>{status === "Extraindo" ? "☕" : status === "Aquecendo" ? "🔥" : "✅"}</span>
          <p>{status}</p>
        </div>

        <div className={styles.tempControl}>
          <button onClick={() => setTemperatura(temperatura - 1)}>-</button>
          <div>{temperatura}°C</div>
          <button onClick={() => setTemperatura(temperatura + 1)}>+</button>
        </div>

        <div className={styles.termometro}>
          <div style={{ height: `${temperatura}%` }} className={styles.termometroBar}></div>
          <span>{temperatura}°</span>
        </div>

        <div className={styles.volume}>
          <input type="range" min="0" max="200" value={volume} onChange={(e) => setVolume(+e.target.value)} />
          <p>{volume}ml</p>
        </div>

        <div className={styles.niveis}>
          <button onClick={adicionarAgua}>Adicionar Água</button>
          <span>{agua}%</span>
          <button onClick={adicionarCafe}>Adicionar Café</button>
          <span>{cafe}%</span>
        </div>

        <div className={styles.barraCafeProntoContainer}>
          <div className={styles.barraCafePronto} style={{ width: `${cafePronto}%` }}></div>
        </div>

        {extraindo && (
          <div className={styles.cronometro}>
            <p>{cronometro}s</p>
          </div>
        )}

        <div className={styles.botoes}>
          <button className={styles.botaoGrande} onClick={iniciarPreparo}>☕ Iniciar</button>
          <button className={styles.botaoGrande} onClick={() => setModalTempoAberto(true)}>⏱ Tempo</button>
        </div>

        <div
          className={`${styles.alavanca} ${cafePronto < 25 || torneiraUsos >= 4 ? styles.desativado : ""}`}
          onClick={servirCafe}
        >
          <div className={styles.tracoHorizontal}></div>
          <div className={styles.tracoVertical}></div>
        </div>

        {mensagem && <div className={styles.mensagemServir}>{mensagem}</div>}

        {alertaLimpeza && (
          <div className={styles.alertaLimpeza}>🧼 Limpeza necessária</div>
        )}

        {mostrarPopup && (
          <div className={styles.popup}>
            <div>
              <h3>Erro</h3>
              <p>Volume, água ou café insuficiente para preparo.</p>
              <button onClick={() => setMostrarPopup(false)}>Entendi</button>
            </div>
          </div>
        )}

        {modalTempoAberto && (
          <div className={styles.modalTempo}>
            <div>
              <h3>Tempo de extração</h3>
              <input type="number" value={tempo} onChange={(e) => setTempo(+e.target.value)} />
              <button onClick={() => setModalTempoAberto(false)}>Pronto</button>
            </div>
          </div>
        )}

        <div className={styles.config}>
          <label>
            <input type="checkbox" checked={somAtivo} onChange={(e) => setSomAtivo(e.target.checked)} />
            Som
          </label>
          <label>
            <input type="checkbox" checked={vibrar} onChange={(e) => setVibrar(e.target.checked)} />
            Vibração
          </label>
        </div>
      </div>
    </>
  );
}

export default Cafeteira5;
