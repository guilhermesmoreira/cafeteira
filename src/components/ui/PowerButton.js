import { useState, useRef } from "react";
import styles from "./PowerButton.module.css";

export default function PowerButton({ onToggle, onLongPress }) {
  const [pressionado, setPressionado] = useState(false);
  const timerRef = useRef(null);

  const iniciarPressionamento = () => {
    setPressionado(true);

    // Inicia um timer de 2 segundos para ativar a ação de longa pressão
    timerRef.current = setTimeout(() => {
      onLongPress();
    }, 2000);
  };

  const soltarBotao = () => {
    setPressionado(false);
    clearTimeout(timerRef.current);
    onToggle();
  };

  return (
    <button
      className={`${styles.powerButton} ${pressionado ? styles.pressed : ""}`}
      onMouseDown={iniciarPressionamento}
      onMouseUp={soltarBotao}
      onMouseLeave={soltarBotao}
      onTouchStart={iniciarPressionamento}
      onTouchEnd={soltarBotao}
    >
      ⚡
    </button>
  );
}
