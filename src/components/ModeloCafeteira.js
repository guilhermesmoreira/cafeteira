import React, { useState } from "react";
import styles from "./ModeloCafeteira.module.css";

function ModeloCafeteira({ children }) {
  const [ligado, setLigado] = useState(false);

  return (
    <div className={styles.container}>
      {/* Botão On/Off no canto superior direito */}
      <button
        className={`${styles.botaoOnOff} ${ligado ? styles.on : styles.off}`}
        onClick={() => setLigado(!ligado)}
      >
        {ligado ? "On" : "Off"}
      </button>

      {/* Barra lateral esquerda (Água) */}
      <div className={styles.barraLateralAgua}>
        <div className={styles.barraAgua}>
          
        </div>
      </div>

      {/* Barra superior (Café) */}
      <div className={styles.barraSuperiorCafe}>
        <div className={styles.barraCafe}>
          
        </div>
      </div>

      {/* Área interna onde você encaixa as cafeteiras */}
      <div className={styles.conteudo}>
        {children}
      </div>
    </div>
  );
}

export default ModeloCafeteira;
