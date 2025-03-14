import { useState } from "react";
import styles from "./RotarySwitch.module.css"; // Importação do CSS

export default function RotarySwitch({ onChange }) {
  const [modo, setModo] = useState("preparo");

  const alternarModo = () => {
    const novoModo = modo === "preparo" ? "limpeza" : "preparo";
    setModo(novoModo);
    onChange(novoModo);
  };

  return (
    <div className={styles.switchContainer}>
      <div className={`${styles.knob} ${modo === "limpeza" ? styles.rotated : ""}`} onClick={alternarModo}>
        <span className={styles.label}>{modo === "preparo" ? "☕" : "🛠️"}</span>
      </div>
      <p className={styles.modoTexto}>Modo: {modo === "preparo" ? "Preparo" : "Limpeza"}</p>
    </div>
  );
}
