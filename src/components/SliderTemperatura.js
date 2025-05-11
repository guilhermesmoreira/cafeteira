import React, { useState } from "react";
import styles from "./SliderTemperatura.module.css";

const SliderTemperatura = () => {
  const [temperatura, setTemperatura] = useState(90);
  const [modoCelsius, setModoCelsius] = useState(true);

  const temperaturaMin = 85;
  const temperaturaMax = 95;

  const alterarTemperatura = (valor) => {
    const novaTemp = Math.max(temperaturaMin, Math.min(temperaturaMax, valor));
    setTemperatura(novaTemp);
  };

  const alternarUnidade = () => {
    setModoCelsius(!modoCelsius);
  };

  const mostrarTemperatura = () => {
    if (modoCelsius) return `${temperatura}°C`;
    return `${Math.round(temperatura * 9 / 5 + 32)}°F`;
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.topo}>
        <button onClick={() => alterarTemperatura(temperatura - 1)}>-</button>
        <span className={styles.valor}>{mostrarTemperatura()}</span>
        <button onClick={() => alterarTemperatura(temperatura + 1)}>+</button>
      </div>

      <input
        type="range"
        min={temperaturaMin}
        max={temperaturaMax}
        value={temperatura}
        onChange={(e) => alterarTemperatura(parseInt(e.target.value))}
        className={styles.slider}
      />

      <div className={styles.legenda}>
        <span>85°C / 185°F</span>
        <span>95°C / 205°F</span>
      </div>

      <div className={styles.switchContainer}>
        <label className={styles.switch}>
          <input type="checkbox" checked={!modoCelsius} onChange={alternarUnidade} />
          <span className={styles.sliderSwitch}></span>
        </label>
        <span className={styles.unidade}>{modoCelsius ? "Celsius" : "Fahrenheit"}</span>
      </div>
    </div>
  );
};

export default SliderTemperatura;
