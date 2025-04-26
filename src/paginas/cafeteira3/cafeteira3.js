// Atualizado Cafeteira3.js aplicando as melhorias (S1 a S12)
import { useState, useEffect } from "react";
import styles from "../../paginas/cafeteira3/cafeteira3.module.css";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Alert } from "../../components/ui/alert";
import RotarySwitch from "../../components/ui/RotarySwitch";
import PowerButton from "../../components/ui/PowerButton";
import TouchPanel from "../../components/ui/TouchPanel";

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
  const [agua, setAgua] = useState(80);
  const [progresso, setProgresso] = useState(0);
  const [status, setStatus] = useState("Pronto");
  const [necessitaLimpeza, setNecessitaLimpeza] = useState(false);
  const [intensidadeCafe, setIntensidadeCafe] = useState(3);
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

  useEffect(() => {
    if (agua < 20) {
      setStatus("Baixo Nível de Água");
      playSound("beep.mp3");
      vibrar("curto");
    } else if (necessitaLimpeza) {
      setStatus("Necessita Limpeza");
      playSound("beep.mp3");
      vibrar("curto");
    } else {
      setStatus("Pronto");
    }
  }, [agua, necessitaLimpeza]);

  const iniciar = () => {
    if (!ligada) return;
    setProgresso(0);
    let interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Pronto");
          playSound(modo === "preparo" ? "somCafePronto.wav" : "somLimpar.wav");
          vibrar("longo");
          setNecessitaLimpeza(modo === "preparo");
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    if (modo === "preparo") {
      setStatus("Preparando Café");
      playSound("beep.mp3");
    } else {
      setStatus("Limpando Máquina");
      playSound("beep.mp3");
    }
  };

  const ligarOuDesligar = () => {
    setLigada((prev) => !prev);
    playSound("beep.mp3");
    vibrar("curto");
  };

  const abrirModalTempo = () => {
    setMostrarTempoModal(true);
  };

  const confirmarTempo = () => {
    setMostrarTempoModal(false);
    playSound("beep.mp3");
  };

  const alterarVolume = (e) => {
    setVolume(e.target.value);
    playSound("beep.mp3");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <h2 className="text-xl font-bold">Cafeteira Inteligente</h2>

          <div className={styles.statusBar}>
            <span>Status: {status}</span>
            <LEDIndicator status={status} />
          </div>

          <button onClick={ligarOuDesligar} className={styles.button}>
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
          <TouchPanel onConfigChange={() => {}} onCleanMode={() => setModo("limpeza")} />

          <div className={styles.volumeSection}>
            <label>Volume no Recipiente: {volume}ml</label>
            <input
              type="range"
              min="100"
              max="500"
              value={volume}
              onChange={alterarVolume}
            />
          </div>

          {status === "Preparando Café" && (
            <>
              <p>Tempo de Extração: {tempoExtracao} segundos</p>
              <Progress value={progresso} />
            </>
          )}

          {status === "Limpando Máquina" && (
            <>
              <p>Realizando limpeza...</p>
              <Progress value={progresso} />
            </>
          )}

          {alerta && (
            <Alert type={alerta.type} message={alerta.message} />
          )}

          <button className={styles.button} onClick={iniciar} disabled={!ligada}>
            Iniciar {modo === "preparo" ? "Preparo" : "Limpeza"}
          </button>

          <button className={styles.button} onClick={abrirModalTempo}>
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
                  onChange={(e) => setTempoExtracao(e.target.value)}
                />
                <button onClick={confirmarTempo} className={styles.button}>
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
  );
}
