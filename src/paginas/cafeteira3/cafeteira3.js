// Chat Puro
import { useState, useEffect } from "react";
import styles from "../../paginas/cafeteira3/cafeteira3.module.css";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Alert } from "../../components/ui/alert";
import RotarySwitch from "../../components/ui/RotarySwitch";
import PowerButton from "../../components/ui/PowerButton";
import TouchPanel from "../../components/ui/TouchPanel";
import ModeloCafeteira from "../../components/ModeloCafeteira";

const LEDIndicator = ({ status }) => {
  const getLEDColor = (status) => {
    switch (status) {
      case "Pronto": return "green";
      case "Preparando Café": return "yellow";
      case "Limpando Máquina": return "blue";
      case "Erro": return "red";
      default: return "gray";
    }
  };

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: getLEDColor(status),
        margin: "10px",
        transition: "background-color 0.3s ease",
      }}
    ></div>
  );
};

export default function Cafeteira3() {
  const [ligada, setLigada] = useState(false);
  const [modo, setModo] = useState("preparo");
  const [agua, setAgua] = useState(0);
  const [cafe, setCafe] = useState(0);
  const [cafePronto, setCafePronto] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [status, setStatus] = useState("Pronto");
  const [necessitaLimpeza, setNecessitaLimpeza] = useState(false);
  const [temperatura, setTemperatura] = useState(92);
  const [tempoExtracao, setTempoExtracao] = useState(25);
  const [mostrarTempoModal, setMostrarTempoModal] = useState(false);
  const [volume, setVolume] = useState(200);
  const [somAtivo, setSomAtivo] = useState(true);
  const [vibracaoAtiva, setVibracaoAtiva] = useState(true);
  const [alerta, setAlerta] = useState(null);

  const playSound = (soundFile) => {
    if (!somAtivo) return;
    const sound = new Audio(`/sounds/${soundFile}`);
    sound.play();
  };

  const vibrar = (tipo) => {
    if (!vibracaoAtiva) return;
    navigator.vibrate(tipo === "curto" ? 100 : 400);
  };

  const iniciar = () => {
    if (!ligada) return;
    if (agua < 20 || cafe < 20) {
      setStatus("Erro");
      setAlerta({ type: "error", message: "Água ou café insuficiente." });
      playSound("beep.mp3");
      vibrar("curto");
      return;
    }

    setAlerta(null);
    setProgresso(0);
    setAgua((prev) => prev - 20);
    setCafe((prev) => prev - 20);

    let interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Pronto");
          setCafePronto((prev) => Math.min(100, prev + 25));
          playSound(modo === "preparo" ? "somCafePronto.wav" : "somLimpar.wav");
          vibrar("longo");
          setNecessitaLimpeza(modo === "preparo");
          return 100;
        }
        return prev + 1;
      });
    }, tempoExtracao * 10);

    setStatus(modo === "preparo" ? "Preparando Café" : "Limpando Máquina");
    playSound("beep.mp3");
  };

  const servirCafe = () => {
    if (cafePronto >= 25) {
      setCafePronto((prev) => prev - 25);
      playSound("beep.mp3");
      vibrar("curto");
    }
  };

  return (
    <ModeloCafeteira>
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <h2 className="text-xl font-bold">Cafeteira Inteligente 3</h2>

          <div className={styles.statusBar}>
            <span>Status: {status}</span>
            <LEDIndicator status={status} />
          </div>

          <button onClick={() => setLigada((prev) => !prev)} className={styles.button}>
            {ligada ? "Desligar" : "Ligar"}
          </button>

          <div className={styles.temperaturaSection}>
            <label>Temperatura: {temperatura}°C</label>
            <input
              type="range"
              min="85"
              max="100"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
            />
          </div>

          <RotarySwitch onChange={setModo} />
          <TouchPanel onConfigChange={() => { }} onCleanMode={() => setModo("limpeza")} />

          <div className={styles.volumeSection}>
            <label>Volume no Recipiente: {volume}ml</label>
            <input
              type="range"
              min="100"
              max="500"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>

          <div className={styles.insumos}>
            <div className={styles.barraLabel}>
              <span>Água</span>
              <span>{agua}%</span>
            </div>
            <div className={styles.barra}>
              <div
                className={`${styles.barraInterna} ${styles.barraAgua}`}
                style={{ width: `${agua}%` }}
              ></div>
            </div>

            <Progress value={agua} />
            <button onClick={() => setAgua(100)}>+ Água</button>

            <div className={styles.barraLabel}>
              <span>Café</span>
              <span>{cafe}%</span>
            </div>
            <div className={styles.barra}>
              <div
                className={`${styles.barraInterna} ${styles.barraCafe}`}
                style={{ width: `${cafe}%` }}
              ></div>
            </div>

            <Progress value={cafe} />
            <button onClick={() => setCafe(100)}>+ Café</button>

            <div className={styles.barraLabel}>
              <span>Café Pronto</span>
              <span>{cafePronto}%</span>
            </div>
            <div className={styles.barra}>
              <div
                className={`${styles.barraInterna} ${styles.barraPronto}`}
                style={{ width: `${cafePronto}%` }}
              ></div>
            </div>

            <Progress value={cafePronto} />
            <div
              className={`${styles.alavanca} ${(cafePronto < 25) ? styles.desativado : ""}`}
              onClick={servirCafe}
            >
              <div className={styles.tracoHorizontal}></div>
              <div className={styles.tracoVertical}></div>
            </div>
          </div>

          {(status === "Preparando Café" || status === "Limpando Máquina") && (
            <>
              <p>Tempo de Extração: {tempoExtracao} segundos</p>
              <Progress value={progresso} />
            </>
          )}

          {alerta && (
            <Alert type={alerta.type} message={alerta.message} />
          )}

          <button className={styles.button} onClick={iniciar} disabled={!ligada}>
            Iniciar {modo === "preparo" ? "Preparo" : "Limpeza"}
          </button>

          <button className={styles.button} onClick={() => setMostrarTempoModal(true)}>
            Ajustar Tempo de Extração
          </button>

          {mostrarTempoModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h3>Tempo de Extração</h3>
                <input
                  type="number"
                  value={tempoExtracao}
                  min="10"
                  max="60"
                  onChange={(e) => setTempoExtracao(Number(e.target.value))}
                />
                <button onClick={() => setMostrarTempoModal(false)} className={styles.button}>
                  Pronto
                </button>
              </div>
            </div>
          )}

          <div className={styles.configSection}>
            <label>
              Sons: <input type="checkbox" checked={somAtivo} onChange={() => setSomAtivo(!somAtivo)} />
            </label>
            <label>
              Vibração: <input type="checkbox" checked={vibracaoAtiva} onChange={() => setVibracaoAtiva(!vibracaoAtiva)} />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
    </ModeloCafeteira>
  );
}
