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
  const [intensidadeCafe, setIntensidadeCafe] = useState("Médio");

  const playSound = (soundFile) => {
    const sound = new Audio(`/sounds/${soundFile}`);
    sound.play();
  };

  useEffect(() => {
    if (agua < 20) {
      setStatus("Baixo Nível de Água");
      playSound("beep.mp3");
    } else if (necessitaLimpeza) {
      setStatus("Necessita Limpeza");
      playSound("beep.mp3");
    } else {
      setStatus("Pronto");
    }
  }, [agua, necessitaLimpeza]);

  const iniciar = () => {
    if (!ligada) return;
    setProgresso(100);

    if (modo === "preparo") {
      setStatus("Preparando Café");
      playSound("beep.mp3");
      setTimeout(() => {
        setStatus("Pronto");
        playSound("somCafePronto.wav");
      }, 3000);
    } else {
      setStatus("Limpando Máquina");
      playSound("beep.mp3");
      setTimeout(() => {
        setStatus("Pronto");
        playSound("somLimpar.wav");
      }, 3000);
    }
  };

  const ligarOuDesligar = () => {
    setLigada((prev) => !prev);
    playSound("beep.mp3");
  };

  const alterarIntensidade = (novaIntensidade) => {
    setIntensidadeCafe(novaIntensidade);
    playSound("beep.mp3");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <h2 className="text-xl font-bold">Cafeteira Inteligente</h2>
          
          <button onClick={ligarOuDesligar} className={styles.button}>
            {ligada ? "Desligar" : "Ligar"}
          </button>
          
          <RotarySwitch onChange={setModo} />
          <TouchPanel onCleanMode={() => setModo("limpeza")} />
          <LEDIndicator status={status} />
          
          <div>
            <p>Intensidade do Café: {intensidadeCafe}</p>
            <button onClick={() => alterarIntensidade("Fraco")}>
              Fraco
            </button>
            <button onClick={() => alterarIntensidade("Médio")}>
              Médio
            </button>
            <button onClick={() => alterarIntensidade("Forte")}>
              Forte
            </button>
          </div>

          {status === "Preparando Café" && (
            <div>
              <p>Aquecendo a água...</p>
              <Progress value={progresso} />
            </div>
          )}

          {status === "Limpando Máquina" && (
            <div>
              <p>Iniciando limpeza...</p>
              <Progress value={progresso} />
            </div>
          )}

          {status === "Baixo Nível de Água" && (
            <Alert className={`${styles.alert} ${styles.warning}`}>
              Atenção: Nível de água baixo!
            </Alert>
          )}

          {status === "Necessita Limpeza" && (
            <Alert className={`${styles.alert} ${styles.warning}`}>
              Atenção: A cafeteira precisa de limpeza!
            </Alert>
          )}

          <button className={styles.button} onClick={iniciar} disabled={!ligada}>
            Iniciar {modo === "preparo" ? "Preparo" : "Limpeza"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
