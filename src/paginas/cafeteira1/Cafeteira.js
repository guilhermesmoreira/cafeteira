import React, { useState, useEffect } from "react";
import style from "./Cafeteira.module.css";
import somCafePronto from '../../assets/somCafePronto.wav';
import somLimpar from '../../assets/somLimpar.wav';
import SliderTemperatura from "../../components/SliderTemperatura";
import CronometroCafe from "../../components/CronometroCafe";

const Cafeteira = () => {
  const [agua, setAgua] = useState(0);
  const [cafe, setCafe] = useState(0);
  const [ligada, setLigada] = useState(false);
  const [preenchendoAgua, setPreenchendoAgua] = useState(false);
  const [preenchendoCafe, setPreenchendoCafe] = useState(false);
  const [cafePronto, setCafePronto] = useState(false);
  const [corAgua, setCorAgua] = useState("#00bfff");
  const [mensagem, setMensagem] = useState("");
  const [cafeServido, setCafeServido] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [temperatura, setTemperatura] = useState(90);
  const [tempoCronometro, setTempoCronometro] = useState(0);

  useEffect(() => {
    let intervalo;
    if (preenchendoAgua && agua < 100) {
      intervalo = setInterval(() => {
        setAgua((prev) => prev + 1);
      }, 100);
    } else if (agua >= 100) {
      setPreenchendoAgua(false);
    }
    return () => clearInterval(intervalo);
  }, [preenchendoAgua, agua]);

  useEffect(() => {
    let intervalo;
    if (preenchendoCafe && cafe < 100) {
      intervalo = setInterval(() => {
        setCafe((prev) => prev + 1);
      }, 100);
    } else if (cafe >= 100) {
      setPreenchendoCafe(false);
    }
    return () => clearInterval(intervalo);
  }, [preenchendoCafe, cafe]);

  useEffect(() => {
    if (cafePronto) {
      setMensagem("Preparando Café...");

      const inicio = Date.now();
      const duracao = (15 - (temperatura - 85)) * 1000;

      const intervalo = setInterval(() => {
        const tempoDecorrido = Date.now() - inicio;
        const progresso = Math.min(tempoDecorrido / duracao, 1);

        const azul = [0, 191, 255];
        const marrom = [139, 69, 19];
        const novaCor = azul.map((valor, index) =>
          Math.round(valor + (marrom[index] - valor) * progresso)
        );
        setCorAgua(`rgb(${novaCor.join(",")})`);

        if (progresso >= 1) {
          clearInterval(intervalo);
          setMensagem("Café Pronto!");
          tocarSom(somCafePronto);
          setIsVibrating(true);
          setTimeout(() => setIsVibrating(false), 500);
        }
      }, 50);

      return () => clearInterval(intervalo);
    } else {
      setCorAgua("#00bfff");
      setMensagem("");
    }
  }, [cafePronto, temperatura]);

  const ligarDesligar = () => {
    if (ligada) {
      if (agua === 0 && cafe === 0) {
        setLigada(false);
        setCafePronto(false);
      } else {
        setMensagem("Limpe a máquina antes de desligar!");
      }
    } else {
      setLigada(true);
    }
  };

  const limpar = () => {
    if (ligada) {
      tocarSom(somLimpar);
      setAgua(0);
      setCafe(0);
      setPreenchendoAgua(false);
      setPreenchendoCafe(false);
      setCafePronto(false);
    }
  };

  const adicionarAgua = () => {
    if (ligada) {
      setPreenchendoAgua(!preenchendoAgua);
    }
  };

  const adicionarCafe = () => {
    if (ligada) {
      setPreenchendoCafe(!preenchendoCafe);
    }
  };

  const prepararCafe = () => {
    if (ligada && agua === 100 && cafe === 100) {
      const duracaoSegundos = 15 - (temperatura - 85);
      setTempoCronometro(duracaoSegundos);
      setCafePronto(true);
    }
  };

  const servirCafe = () => {
    if (!cafePronto) return;
    setCafeServido(true);
    setMensagem('Café Servido!');
  };

  const tocarSom = (som) => {
    const audio = new Audio(som);
    audio.play();
  };
  
  return (    
    <div className={`${style.cafeteira} ${isVibrating ? style.vibrateEffect : ''}`}>
      <h2 className="text-xl font-bold">Cafeteira 1</h2>
      <div className={style.containerCafe}>
        <div className={style.barraCafe} style={{ height: `${cafe}%` }}>
          <span className={style.porcentagem}>{cafe}%</span>
        </div>
      </div>

      {mensagem && <div className={style.mensagem}>{mensagem}</div>}

      <div className={style.base}>
        <div
          className={style.barraAgua}
          style={{ height: `${agua}%`, backgroundColor: corAgua }}
        >
          <span className={style.porcentagem}>{agua}%</span>
        </div>
      </div>

      <div className={style.corpo}>
        <div className={style.secaoControle}>
          <SliderTemperatura temperatura={temperatura} setTemperatura={setTemperatura} />
          {cafePronto && tempoCronometro > 0 && (
            <CronometroCafe tempoTotal={tempoCronometro} />
          )}
          <div className={style.temperaturaAtual}>
            Temp. atual da água: {temperatura}°C ({Math.round(temperatura * 9 / 5 + 32)}°F)
          </div>
        </div>

        <div className={style.botoes}>
          <div className={style.botoesSuperiores}>
            <div
              className={`${style.botaoAgua} ${!ligada ? style.desativado : ""}`}
              onClick={adicionarAgua}
            >
              {preenchendoAgua ? "Pausar" : "Água"}
            </div>
            <div
              className={`${style.botaoCafe} ${!ligada ? style.desativado : ""}`}
              onClick={adicionarCafe}
            >
              {preenchendoCafe ? "Pausar" : "Café"}
            </div>
          </div>

          <div
            className={`${style.botaoPreparar} ${(!ligada || agua < 100 || cafe < 100) ? style.desativado : ""}`}
            onClick={prepararCafe}
          >
            Preparar Café
          </div>

          <div
            className={`${style.alavanca} ${!cafePronto ? style.desativado : ""}`}
            onClick={servirCafe}
          >
            <div className={style.tracoHorizontal}></div>
            <div className={style.tracoVertical}></div>
          </div>
        </div>

        <div className={`${style.botaoLimpar} ${!ligada ? style.desativado : ""}`} onClick={limpar}>
          Limpar
        </div>
      </div>

      <button
        className={`${style.botaoLigar} ${ligada ? style.ligado : ""}`}
        onClick={ligarDesligar}
      >
        {ligada ? "ON" : "OFF"}
      </button>
    </div>
  );
};

export default Cafeteira;