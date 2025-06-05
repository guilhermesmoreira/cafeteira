import React, { useState, useEffect } from 'react';
import styles from './cafeteira2.module.css';
import { MdPowerSettingsNew, MdWaterDrop, MdCoffeeMaker, MdCoffee, MdCleaningServices } from 'react-icons/md';
import beepSound from '../../assets/beep.mp3';
import coffeeReadySound from '../../assets/somCafePronto.wav';
import cleanSound from '../../assets/somLimpar.wav';
import { GiCoffeeBeans } from "react-icons/gi";


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
      <p>Café Pronto: {brewedCoffeeLevel.toFixed(2)}%</p>
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
  const [isVibrating, setIsVibrating] = useState(false);
  const [temperatura, setTemperatura] = useState(92);
  const [tempoExtracao, setTempoExtracao] = useState(25); // 25 segundos padrão
  const [mostrarModalTempo, setMostrarModalTempo] = useState(false);
  const [tempoPreparoRestante, setTempoPreparoRestante] = useState(0);
  const [vibracaoAtiva, setVibracaoAtiva] = useState(true);
  const [somAtivo, setSomAtivo] = useState(true);

  const tocarSom = (audio) => {
    if (!somAtivo) return;
    audio.currentTime = 0; // reinicia o som para cada evento
    audio.play();
  };

  // Instâncias de áudio
  const beep = new Audio(beepSound);
  const coffeeReady = new Audio(coffeeReadySound);
  const clean = new Audio(cleanSound);

  const alterarTemperatura = (e) => {
    setTemperatura(e.target.value);
  };

  const abrirModalTempo = () => {
    setMostrarModalTempo(true);
  };

  const confirmarTempo = () => {
    setMostrarModalTempo(false);
  };

  const vibrar = (tipo) => {
    if (!vibracaoAtiva || !navigator.vibrate) return;

    if (tipo === 'curto') {
      navigator.vibrate(100); // vibração de 100ms
    } else if (tipo === 'longo') {
      navigator.vibrate(400); // vibração de 400ms
    }
  };


  // Toca beep.mp3 ao ligar a máquina
  useEffect(() => {
    if (isOn) {
      tocarSom(beep);
    }
  }, [isOn]);


  // Controle de status para café pronto (somCafePronto.wav)
  useEffect(() => {
    if (brewedCoffeeLevel === 100 && status !== 'pronto') {
      setStatus('pronto');
      tocarSom(coffeeReady); // Toca somCafePronto.wav quando a barra marrom atinge 100%
      setIsVibrating(true); // Ativa a vibração
      setTimeout(() => setIsVibrating(false), 500); // Desativa após 0,5 segundos
    }
  }, [brewedCoffeeLevel, status]);

  // Toca somLimpar.wav quando a limpeza termina
  useEffect(() => {
    if (mode === 'limpeza' && cleaningProgress === 100 && status === 'aguardando') {
      tocarSom(clean);
    }
  }, [cleaningProgress, status, mode]);

  const addWater = () => {
    if (isOn && mode === 'preparo' && waterLevel < 100 && !waterAdded) {
      tocarSom(beep);
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

      let segundosTotal = parseInt(tempoExtracao); // valor escolhido pelo usuário
      let progressoAtual = 0;

      setTempoPreparoRestante(segundosTotal); // Iniciar contagem regressiva
      const interval = setInterval(() => {
        setBrewedCoffeeLevel((prevBrew) => {
          const novoProgresso = prevBrew + (100 / segundosTotal / 10); // atualizar proporcionalmente

          // A cada 100ms -> atualizar 1/10 do segundo

          if (novoProgresso >= 100) {
            clearInterval(interval);
            setStatus('pronto');
            setTempoPreparoRestante(0); // zera o tempo restante
            return 100;
          }

          return novoProgresso;
        });

        setTempoPreparoRestante((prevTempo) => {
          if (prevTempo <= 0) return 0;
          return (prevTempo - 0.1).toFixed(1); // diminui 0.1s a cada 100ms
        });
      }, 100); // a cada 100 milissegundos
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
    <>
    <h2 className="text-xl font-bold">Cafeteira 2</h2>
    <div className={`${styles.coffeeMakerContainer} ${isVibrating ? styles.vibrateEffect : ''}`}>
      
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
          <p>Tempo de Preparo: {tempoPreparoRestante > 0 ? `${tempoPreparoRestante}s` : "0s"}</p>
          <div className={styles.temperaturaControl}>
            <label>Temperatura Inicial da Água: {temperatura}°C</label>
            <input
              type="range"
              min="85"
              max="100"
              value={temperatura}
              onChange={alterarTemperatura}
              className={styles.sliderTemperatura}
            />
          </div>
          <button className={styles.button} onClick={abrirModalTempo}>
            Ajustar Tempo de Extração
          </button>
          {mostrarModalTempo && (
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
                <GiCoffeeBeans />
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
        <div className={styles.configSection}>
          <label>
            Sons: <input type="checkbox" checked={somAtivo} onChange={() => setSomAtivo(!somAtivo)} />
          </label>
        </div>
        <div className={styles.configSection}>
          <label>
            Vibração: <input type="checkbox" checked={vibracaoAtiva} onChange={() => setVibracaoAtiva(!vibracaoAtiva)} />
          </label>
        </div>
        <WaterLevelBar waterLevel={waterLevel} />
        <div className={styles.temperatureLevelContainer}>
          <div
            className={styles.temperatureLevel}
            style={{ height: `${(temperatura - 85) * 6.66}%` }} // mapeando 85-100 para 0-100%
          ></div>
          <div className={styles.temperatureText}>
            {temperatura}°C
          </div>
        </div>
        <CoffeeLevelBar coffeeLevel={coffeeLevel} />
        <BrewedCoffeeBar brewedCoffeeLevel={brewedCoffeeLevel} />
        <div className={styles.volumeRecipienteContainer}>
          <div className={styles.volumeRecipienteBar}>
            <div
              className={styles.volumeRecipienteFill}
              style={{ width: `${brewedCoffeeLevel}%` }}
            ></div>
          </div>
          <p>{Math.round((brewedCoffeeLevel / 100) * 500)} ml</p>
        </div>

      </div>
    </div>
    </>
    
  );
}

export default Cafeteira2;