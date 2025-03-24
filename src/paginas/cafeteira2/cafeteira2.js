import React, { useState, useEffect } from 'react';
import styles from './cafeteira2.module.css';
import { MdPowerSettingsNew, MdWaterDrop, MdCoffeeMaker, MdCoffee, MdCleaningServices } from 'react-icons/md';
import beepSound from '../../assets/beep.mp3';
import coffeeReadySound from '../../assets/somCafePronto.wav';
import cleanSound from '../../assets/somLimpar.wav';

function PowerButton({ isOn, setIsOn }) {
  return (
    <button
      className={`${styles.powerButton} ${isOn ? styles.powerButtonOn : styles.powerButtonOff}`}
      onClick={() => setIsOn(!isOn)}
    >
      <MdPowerSettingsNew className={styles.powerIcon} />
    </button>
  );
}

function ModeSelector({ mode, setMode }) {
  return (
    <div className={styles.modeSelector}>
      <button
        className={`${styles.modeSelectorButton} ${mode === 'preparo' ? styles.modeSelectorButtonActive : ''}`}
        onClick={() => setMode('preparo')}
      >
        Preparo
      </button>
      <button
        className={`${styles.modeSelectorButton} ${mode === 'limpeza' ? styles.modeSelectorButtonActive : ''}`}
        onClick={() => setMode('limpeza')}
      >
        Limpeza
      </button>
      <div
        className={styles.modeArrow}
        style={{
          left: mode === 'preparo' ? '25%' : '75%',
          transform: mode === 'preparo' ? 'rotate(-30deg)' : 'rotate(30deg)',
        }}
      >
        ▲
      </div>
    </div>
  );
}

function LedIndicators({ status }) {
  const getLedColor = () => {
    switch (status) {
      case 'pronto': return styles.ledGreen;
      case 'preparando': return styles.ledYellow;
      case 'limpando': return styles.ledBlue;
      case 'aguardando': return styles.ledGray;
      case 'erro': return styles.ledRed;
      default: return styles.ledGray;
    }
  };
  return (
    <div className={styles.ledIndicators}>
      <div className={`${styles.led} ${getLedColor()}`}></div>
    </div>
  );
}

function DisplayScreen({ status, waterLevel, mode, cleaningProgress, coffeeLevel, brewedCoffeeLevel }) {
  return (
    <div className={styles.displayScreen}>
      <p>Status: {status}</p>
      <p>Nível de Água: {waterLevel}%</p>
      <p>Nível de Café: {coffeeLevel}%</p>
      <p>Café Pronto: {brewedCoffeeLevel}%</p>
      {mode === 'limpeza' ? (
        <p>Progresso da Limpeza: {cleaningProgress}%</p>
      ) : (
        <p style={{ visibility: 'hidden' }}>Progresso da Limpeza: 0%</p>
      )}
    </div>
  );
}

function WaterLevelBar({ waterLevel }) {
  return (
    <div className={styles.waterLevelContainer}>
      <div className={styles.waterLevel} style={{ height: `${waterLevel}%` }}></div>
    </div>
  );
}

function CoffeeLevelBar({ coffeeLevel }) {
  return (
    <div className={styles.coffeeLevelContainer}>
      <div className={styles.coffeeLevel} style={{ height: `${coffeeLevel}%` }}></div>
    </div>
  );
}

function BrewedCoffeeBar({ brewedCoffeeLevel }) {
  return (
    <div className={styles.brewedCoffeeContainer}>
      <div className={styles.brewedCoffee} style={{ height: `${brewedCoffeeLevel}%` }}></div>
    </div>
  );
}

function Cafeteira2() {
  const [isOn, setIsOn] = useState(false);
  const [mode, setMode] = useState('preparo');
  const [waterLevel, setWaterLevel] = useState(0);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [brewedCoffeeLevel, setBrewedCoffeeLevel] = useState(0);
  const [status, setStatus] = useState('aguardando');
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [waterAdded, setWaterAdded] = useState(false);
  const [coffeeAdded, setCoffeeAdded] = useState(false);

  // Instâncias de áudio
  const beep = new Audio(beepSound);
  const coffeeReady = new Audio(coffeeReadySound);
  const clean = new Audio(cleanSound);

  // Toca beep.mp3 ao ligar a máquina
  useEffect(() => {
    if (isOn) {
      beep.play();
    }
  }, [isOn]);

  // Controle de status para café pronto (somCafePronto.wav)
  useEffect(() => {
    if (brewedCoffeeLevel === 100 && status !== 'pronto') {
      setStatus('pronto');
      coffeeReady.play(); // Toca somCafePronto.wav quando a barra marrom atinge 100%
    }
  }, [brewedCoffeeLevel, status]);

  // Toca somLimpar.wav quando a limpeza termina
  useEffect(() => {
    if (mode === 'limpeza' && cleaningProgress === 100 && status === 'aguardando') {
      clean.play();
    }
  }, [cleaningProgress, status, mode]);

  const addWater = () => {
    if (isOn && mode === 'preparo' && waterLevel < 100 && !waterAdded) {
      setStatus('preparando');
      setWaterAdded(true);
      const interval = setInterval(() => {
        setWaterLevel((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (coffeeLevel === 100 && brewedCoffeeLevel === 0) {
              setStatus('pronto'); // Define "pronto" apenas quando ambas as barras estão em 100%
            } else {
              setStatus('aguardando');
            }
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const addCoffee = () => {
    if (isOn && mode === 'preparo' && coffeeLevel < 100 && !coffeeAdded) {
      setStatus('preparando');
      setCoffeeAdded(true);
      const interval = setInterval(() => {
        setCoffeeLevel((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (waterLevel === 100 && brewedCoffeeLevel === 0) {
              setStatus('pronto'); // Define "pronto" apenas quando ambas as barras estão em 100%
            } else {
              setStatus('aguardando');
            }
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const brewCoffee = () => {
    if (isOn && mode === 'preparo' && waterLevel === 100 && coffeeLevel === 100) {
      setStatus('preparando');
      const interval = setInterval(() => {
        setBrewedCoffeeLevel((prevBrew) => {
          if (prevBrew >= 100) {
            clearInterval(interval);
            setStatus('pronto');
            return 100;
          }
          const newBrew = prevBrew + 1;
          setWaterLevel(100 - newBrew);
          setCoffeeLevel(100 - newBrew);
          return newBrew;
        });
      }, 50);
    }
  };

  const cleanMachine = () => {
    if (isOn && mode === 'limpeza' && brewedCoffeeLevel > 0) {
      setStatus('limpando');
      const interval = setInterval(() => {
        setBrewedCoffeeLevel((prevBrew) => {
          if (prevBrew <= 0) {
            clearInterval(interval);
            setStatus('aguardando');
            setWaterLevel(0);
            setCoffeeLevel(0);
            setWaterAdded(false);
            setCoffeeAdded(false);
            return 0;
          }
          const newBrew = prevBrew - 1;
          setCleaningProgress(100 - newBrew);
          return newBrew;
        });
      }, 50);
    } else if (isOn && mode === 'limpeza') {
      setStatus('limpando');
      setCleaningProgress(100);
      setWaterLevel(0);
      setCoffeeLevel(0);
      setWaterAdded(false);
      setCoffeeAdded(false);
      setTimeout(() => setStatus('aguardando'), 1000);
    }
  };

  return (
    <div className={styles.coffeeMakerContainer}>
      <div className={styles.coffeeMaker}>
        <div className={styles.topBar}>
          <PowerButton isOn={isOn} setIsOn={setIsOn} />
        </div>
        <div className={styles.modeSelectorContainer}>
          <ModeSelector mode={mode} setMode={setMode} />
        </div>
        <div className={styles.controls}>
          <LedIndicators status={status} />
          <DisplayScreen
            status={status}
            waterLevel={waterLevel}
            mode={mode}
            cleaningProgress={cleaningProgress}
            coffeeLevel={coffeeLevel}
            brewedCoffeeLevel={brewedCoffeeLevel}
          />
          <div className={styles.actionButtonsContainer}>
            <div className={styles.buttonColumn}>
              <button
                className={`${styles.waterButton} ${mode === 'limpeza' || waterAdded ? styles.disabledButton : ''}`}
                onClick={addWater}
                disabled={mode === 'limpeza' || waterAdded}
              >
                <MdWaterDrop />
              </button>
              <button
                className={`${styles.brewButton} ${mode === 'limpeza' ? styles.disabledButton : ''}`}
                onClick={brewCoffee}
                disabled={mode === 'limpeza' || waterLevel !== 100 || coffeeLevel !== 100}
              >
                <MdCoffee />
              </button>
            </div>
            <div className={styles.buttonColumn}>
              <button
                className={`${styles.coffeeBeanButton} ${mode === 'limpeza' || coffeeAdded ? styles.disabledButton : ''}`}
                onClick={addCoffee}
                disabled={mode === 'limpeza' || coffeeAdded}
              >
                <MdCoffeeMaker />
              </button>
              <button
                className={`${styles.cleanButton} ${mode === 'limpeza' ? styles.cleanButtonActive : ''}`}
                onClick={cleanMachine}
                disabled={mode !== 'limpeza'}
              >
                <MdCleaningServices />
              </button>
            </div>
          </div>
        </div>
        <WaterLevelBar waterLevel={waterLevel} />
        <CoffeeLevelBar coffeeLevel={coffeeLevel} />
        <BrewedCoffeeBar brewedCoffeeLevel={brewedCoffeeLevel} />
      </div>
    </div>
  );
}

export default Cafeteira2;