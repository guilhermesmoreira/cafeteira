import { useState } from "react";
import styles from "./TouchPanel.module.css";

export default function TouchPanel({ onConfigChange, onCleanMode }) {
  const [volume, setVolume] = useState(200);
  const [intensidade, setIntensidade] = useState(2);

  const alterarVolume = (e) => {
    const novoVolume = e.target.value;
    setVolume(novoVolume);
    onConfigChange("volume", novoVolume);
  };

  const alterarIntensidade = (novaIntensidade) => {
    setIntensidade(novaIntensidade);
    onConfigChange("intensidade", novaIntensidade);
  };

  return (
    <div className={styles.touchPanel}>
      <h3>Configurações de Preparo</h3>

      <div className={styles.control}>
        <label>Volume de Água: {volume} ml</label>
        <input
          type="range"
          min="100"
          max="500"
          value={volume}
          onChange={alterarVolume}
          className={styles.slider}
        />
      </div>

      <div className={styles.control}>
        <label>Intensidade do Café</label>
        <div className={styles.intensityButtons}>
          {[1, 2, 3, 4, 5].map((nivel) => (
            <button
              key={nivel}
              className={`${styles.intensityButton} ${nivel === intensidade ? styles.selected : ""}`}
              onClick={() => alterarIntensidade(nivel)}
            >
              {nivel}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.cleanButton} onClick={onCleanMode}>
        Ativar Modo de Limpeza
      </button>
    </div>
  );
}
