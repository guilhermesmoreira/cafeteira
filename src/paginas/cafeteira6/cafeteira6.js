import React, { useState, useEffect, useRef } from "react";
import styles from "./cafeteira6.module.css";

import somClique from "../../assets/beep.mp3";
import somErro from "../../assets/somLimpar.wav";
import somPronto from "../../assets/somCafePronto.wav";
import ModeloCafeteira from "../../components/ModeloCafeteira";

function Cafeteira6() {
    const [temperatura, setTemperatura] = useState(92);
    const [tempo, setTempo] = useState(5);
    const [extraindo, setExtraindo] = useState(false);
    const [cronometro, setCronometro] = useState(0);
    const [status, setStatus] = useState("Pronto");
    const [volume, setVolume] = useState(100);
    const [alertaLimpeza, setAlertaLimpeza] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [somAtivo, setSomAtivo] = useState(true);
    const [vibrar, setVibrar] = useState(true);
    const [modalTempoAberto, setModalTempoAberto] = useState(false);
    const [limpando, setLimpando] = useState(false);
    const [progressoLimpeza, setProgressoLimpeza] = useState(0);
    const [cafePronto, setCafePronto] = useState(false);
    const [mensagemCafe, setMensagemCafe] = useState("");
    const audioClique = new Audio(somClique);
    const audioErro = new Audio(somErro);
    const audioPronto = new Audio(somPronto);
    const [agua, setAgua] = useState(0);
    const [cafe, setCafe] = useState(0);
    const aguaIntervalRef = useRef(null);
    const cafeIntervalRef = useRef(null);
    const [nivelCafePronto, setNivelCafePronto] = useState(0);
    const [usosTorneira, setUsosTorneira] = useState(0);




    const tocarSom = (tipo) => {
        if (!somAtivo) return;
        if (tipo === "clique") audioClique.play();
        if (tipo === "erro") audioErro.play();
        if (tipo === "pronto") audioPronto.play();
    };

    const preencherNivel = (tipo) => {
        if (tipo === "agua") {
            if (aguaIntervalRef.current) return; // já preenchendo
            aguaIntervalRef.current = setInterval(() => {
                setAgua((prev) => {
                    if (prev >= 100) {
                        clearInterval(aguaIntervalRef.current);
                        aguaIntervalRef.current = null;
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
        } else if (tipo === "cafe") {
            if (cafeIntervalRef.current) return; // já preenchendo
            cafeIntervalRef.current = setInterval(() => {
                setCafe((prev) => {
                    if (prev >= 100) {
                        clearInterval(cafeIntervalRef.current);
                        cafeIntervalRef.current = null;
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
        }
    };



    const vibrarDispositivo = (duracao = 100) => {
        if (vibrar && navigator.vibrate) {
            navigator.vibrate(duracao);
        }
    };

    const handleBotaoPress = () => {
        vibrarDispositivo(50);
    };

    const iniciarPreparo = () => {
        handleBotaoPress();
        if (extraindo) return;
        if (volume < 50) {
            setMostrarPopup(true);
            tocarSom("erro");
            vibrarDispositivo(500);
            return;
        }

        setStatus("Aquecendo...");
        setTimeout(() => {
            setStatus("Extraindo...");
            setExtraindo(true);
            setCronometro(tempo);
            tocarSom("clique");
        }, 2000);
    };

    useEffect(() => {
        if (!extraindo) return;

        if (cronometro === 0) {
            setStatus("Pronto");
            setExtraindo(false);
            setAlertaLimpeza(true);
            setCafePronto(true);
            setMensagemCafe("☕ Café Pronto!");
            setNivelCafePronto(100); // Completa a barra
            setUsosTorneira(0); // Resetar contador de uso
            tocarSom("pronto");
            vibrarDispositivo(200);
            return;
        }

        // Atualiza nível de café pronto proporcional ao tempo restante
        const novoNivel = 100 - ((cronometro - 1) / tempo) * 100;
        setNivelCafePronto(novoNivel);

        const timer = setTimeout(() => setCronometro(cronometro - 1), 1000);
        return () => clearTimeout(timer);
    }, [cronometro, extraindo]);


    const aumentarTemperatura = () => {
        handleBotaoPress();
        if (temperatura < 100) {
            setTemperatura(temperatura + 1);
        }
    };

    const diminuirTemperatura = () => {
        handleBotaoPress();
        if (temperatura > 80) {
            setTemperatura(temperatura - 1);
        }
    };

    const iniciarLimpeza = () => {
        handleBotaoPress();
        if (extraindo) {
            setMostrarPopup(true);
            setStatus("Erro");
            tocarSom("erro");
            setAgua(0);
            setCafe(0);
            return;
        }

        setLimpando(true);
        setProgressoLimpeza(0);
        setStatus("Limpando...");
        tocarSom("clique");

        const intervalo = setInterval(() => {
            setProgressoLimpeza((prev) => {
                if (prev >= 100) {
                    clearInterval(intervalo);
                    setLimpando(false);
                    setAlertaLimpeza(false);
                    setStatus("Pronto");
                    tocarSom("pronto");
                    vibrarDispositivo(200);
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

    const getStatusIcon = () => {
        switch (status) {
            case "Extraindo...":
                return "☕";
            case "Aquecendo...":
                return "🔥";
            case "Limpando...":
                return "🧼";
            case "Erro":
                return "❌";
            default:
                return "✅";
        }
    };

    const servirCafe = () => {
        if (!cafePronto || nivelCafePronto <= 0 || usosTorneira >= 4) return;

        const novoNivel = Math.max(0, nivelCafePronto - 25);
        setNivelCafePronto(novoNivel);
        setMensagemCafe("☕ Café Servido!");
        setUsosTorneira(usosTorneira + 1);

        if (novoNivel === 0 || usosTorneira + 1 >= 4) {
            setCafePronto(false);
        }
    };


    return (
        <>
        <ModeloCafeteira>
            <h2 className="text-xl font-bold">Cafeteira 6</h2>
            <div className={styles.cafeteira}>
                <div className={styles.topBar}>
                    <span className={styles.statusIcon}>{getStatusIcon()}</span>
                    <span className={styles.statusText}>{status}</span>
                </div>

                <div className={styles.statusArea}>
                    <span className={styles.statusEmoji}>{getStatusIcon()}</span>
                    <p className={styles.statusTexto}>{status}</p>
                </div>

                {mensagemCafe && <div className={styles.mensagem}>{mensagemCafe}</div>}
                <div className={styles.niveisLaterais}>
                    <div className={styles.nivelContainer}>
                        <div className={styles.nivelOuter}>
                            <div className={styles.nivelBarra} style={{ height: `${agua}%`, backgroundColor: '#00f' }}></div>
                        </div>
                        <span className={styles.nivelTexto}>Água</span>
                        <button onClick={() => preencherNivel("agua")}>Adicionar Água</button>
                    </div>
                    <div className={styles.nivelContainer}>
                        <div className={styles.nivelOuter}>
                            <div className={styles.nivelBarra} style={{ height: `${cafe}%`, backgroundColor: '#663300' }}></div>
                        </div>
                        <span className={styles.nivelTexto}>Café</span>
                        <button onClick={() => preencherNivel("cafe")}>Adicionar Café</button>
                    </div>
                </div>
                <div className={styles.termometroContainer}>
                    <div className={styles.termometro}>
                        <div className={styles.termometroBar} style={{ height: `${temperatura}%` }}></div>
                        <div className={styles.termometroMarcacoes}>
                            <span>100°</span>
                            <span>80°</span>
                            <span>60°</span>
                        </div>
                    </div>
                    <div className={styles.temperaturaAtual}>{temperatura}°C</div>
                </div>

                <div className={styles.tempControl}>
                    <button className={styles.botaoControle} onClick={diminuirTemperatura}>-</button>
                    <div className={styles.tempDisplay}>
                        <span className={styles.tempValue}>{temperatura}</span>
                        <span className={styles.tempUnidade}>°C</span>
                    </div>
                    <button className={styles.botaoControle} onClick={aumentarTemperatura}>+</button>
                </div>

                <div className={styles.volumeContainer}>
                    <div className={styles.volumeInfo}>
                        <span className={styles.volumeIcon}>💧</span>
                        <span className={styles.volumeValue}>{volume}ml</span>
                    </div>
                    <input type="range" min="0" max="200" value={volume} onChange={(e) => {
                        handleBotaoPress();
                        setVolume(+e.target.value);
                    }} className={styles.volumeSlider} />
                </div>

                {extraindo && (
                    <div className={styles.cronometroContainer}>
                        <div className={styles.cronometro}>
                            <span className={styles.cronometroNumero}>{cronometro}</span>
                            <span className={styles.cronometroUnidade}>segundos</span>
                        </div>
                        <div className={styles.cronometroBarra} style={{ width: `${(cronometro / tempo) * 100}%` }}></div>
                    </div>
                )}

                <div className={styles.botoesPrincipais}>
                    <button className={`${styles.botaoGrande} ${extraindo || limpando ? styles.desativado : ''}`} onClick={iniciarPreparo}>
                        <span className={styles.botaoIcone}>☕</span>
                        <span className={styles.botaoTexto}>Iniciar</span>
                    </button>
                    <button className={styles.botaoGrande} onClick={() => {
                        handleBotaoPress();
                        setModalTempoAberto(true);
                    }}>
                        <span className={styles.botaoIcone}>⏱</span>
                        <span className={styles.botaoTexto}>Tempo</span>
                    </button>
                    <button className={`${styles.botaoGrande} ${limpando || extraindo ? styles.desativado : ''}`} onClick={iniciarLimpeza}>
                        <span className={styles.botaoIcone}>🧴</span>
                        <span className={styles.botaoTexto}>Limpar</span>
                    </button>
                </div>
                <div className={styles.barraCafePronto}>
                    <div className={styles.preenchimentoCafePronto} style={{ width: `${nivelCafePronto}%` }}></div>
                </div>
                <div className={`${styles.alavanca} ${!cafePronto ? styles.desativado : ""}`} onClick={servirCafe}>
                    <div className={styles.tracoHorizontal}></div>
                    <div className={styles.tracoVertical}></div>
                </div>

                {/* Resto do código continua igual... */}
            </div>
        </ModeloCafeteira>
        </>
    );
}

export default Cafeteira6;
