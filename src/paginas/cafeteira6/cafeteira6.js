import React, { useState, useEffect } from "react";
import styles from "./cafeteira6.module.css";

import somClique from "../../assets/beep.mp3";
import somErro from "../../assets/somLimpar.wav";
import somPronto from "../../assets/somCafePronto.wav";

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

    const audioClique = new Audio(somClique);
    const audioErro = new Audio(somErro);
    const audioPronto = new Audio(somPronto);

    const tocarSom = (tipo) => {
        if (!somAtivo) return;
        if (tipo === "clique") audioClique.play();
        if (tipo === "erro") audioErro.play();
        if (tipo === "pronto") audioPronto.play();
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
            vibrarDispositivo(500); // Vibração mais longa para erro
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
            tocarSom("pronto");
            vibrarDispositivo(200); // Vibração média para conclusão
            return;
        }
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
    return (
        <div className={styles.cafeteira}>
            {/* S8: Indicador de status da máquina */}
            <div className={styles.topBar}>
                <span className={styles.statusIcon}>{getStatusIcon()}</span>
                <span className={styles.statusText}>{status}</span>
            </div>

            {/* S4: Display de status com ícone */}
            <div className={styles.statusArea}>
                <span className={styles.statusEmoji}>{getStatusIcon()}</span>
                <p className={styles.statusTexto}>{status}</p>
            </div>

            {/* S5: Termômetro gráfico */}
            <div className={styles.termometroContainer}>
                <div className={styles.termometro}>
                    <div
                        className={styles.termometroBar}
                        style={{ height: `${temperatura}%` }}
                    ></div>
                    <div className={styles.termometroMarcacoes}>
                        <span>100°</span>
                        <span>80°</span>
                        <span>60°</span>
                    </div>
                </div>
                <div className={styles.temperaturaAtual}>{temperatura}°C</div>
            </div>

            {/* S1: Controle de temperatura */}
            <div className={styles.tempControl}>
                <button
                    className={styles.botaoControle}
                    onClick={diminuirTemperatura}
                    aria-label="Diminuir temperatura"
                >
                    -
                </button>
                <div className={styles.tempDisplay}>
                    <span className={styles.tempValue}>{temperatura}</span>
                    <span className={styles.tempUnidade}>°C</span>
                </div>
                <button
                    className={styles.botaoControle}
                    onClick={aumentarTemperatura}
                    aria-label="Aumentar temperatura"
                >
                    +
                </button>
            </div>

            {/* S6: Controle de volume */}
            <div className={styles.volumeContainer}>
                <div className={styles.volumeInfo}>
                    <span className={styles.volumeIcon}>💧</span>
                    <span className={styles.volumeValue}>{volume}ml</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={volume}
                    onChange={(e) => {
                        handleBotaoPress();
                        setVolume(+e.target.value);
                    }}
                    className={styles.volumeSlider}
                />
            </div>

            {/* S3: Cronômetro durante extração */}
            {extraindo && (
                <div className={styles.cronometroContainer}>
                    <div className={styles.cronometro}>
                        <span className={styles.cronometroNumero}>{cronometro}</span>
                        <span className={styles.cronometroUnidade}>segundos</span>
                    </div>
                    <div
                        className={styles.cronometroBarra}
                        style={{ width: `${(cronometro / tempo) * 100}%` }}
                    ></div>
                </div>
            )}

            {/* S10: Botões principais com feedback tátil */}
            <div className={styles.botoesPrincipais}>
                <button
                    className={`${styles.botaoGrande} ${extraindo || limpando ? styles.desativado : ''}`}
                    onClick={iniciarPreparo}
                >
                    <span className={styles.botaoIcone}>☕</span>
                    <span className={styles.botaoTexto}>Iniciar</span>
                </button>
                <button
                    className={styles.botaoGrande}
                    onClick={() => {
                        handleBotaoPress();
                        setModalTempoAberto(true);
                    }}
                >
                    <span className={styles.botaoIcone}>⏱</span>
                    <span className={styles.botaoTexto}>Tempo</span>
                </button>
                <button
                    className={`${styles.botaoGrande} ${limpando || extraindo ? styles.desativado : ''}`}
                    onClick={iniciarLimpeza}
                >
                    <span className={styles.botaoIcone}>🧴</span>
                    <span className={styles.botaoTexto}>Limpar</span>
                </button>
            </div>

            {/* S7: Alerta de limpeza */}
            {alertaLimpeza && (
                <div className={styles.alertaLimpeza}>
                    <span className={styles.alertaIcone}>🧼</span>
                    <span className={styles.alertaTexto}>Limpeza necessária</span>
                </div>
            )}

            {limpando && (
                <div className={styles.progressoLimpeza}>
                    <div
                        className={styles.progressoLimpezaBarra}
                        style={{ width: `${progressoLimpeza}%` }}
                    ></div>
                    <span className={styles.progressoLimpezaTexto}>
                        {progressoLimpeza}% completo
                    </span>
                </div>
            )}

            {/* S9: Popup de erro */}
            {mostrarPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContainer}>
                        <div className={styles.popupCabecalho}>
                            <span className={styles.popupIcone}>⚠️</span>
                            <h3 className={styles.popupTitulo}>Erro</h3>
                        </div>
                        <p className={styles.popupMensagem}>Volume insuficiente para preparo. Adicione mais água.</p>
                        <button
                            className={styles.popupBotao}
                            onClick={() => {
                                handleBotaoPress();
                                setMostrarPopup(false);
                            }}
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}

            {/* S2: Modal de tempo de extração */}
            {modalTempoAberto && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <h3 className={styles.modalTitulo}>Tempo de extração</h3>
                        <div className={styles.tempoSeletor}>
                            <button
                                className={styles.tempoBotao}
                                onClick={() => {
                                    handleBotaoPress();
                                    if (tempo > 1) setTempo(tempo - 1);
                                }}
                            >
                                -
                            </button>
                            <div className={styles.tempoDisplay}>
                                <span className={styles.tempoValor}>{tempo}</span>
                                <span className={styles.tempoUnidade}>segundos</span>
                            </div>
                            <button
                                className={styles.tempoBotao}
                                onClick={() => {
                                    handleBotaoPress();
                                    if (tempo < 10) setTempo(tempo + 1);
                                }}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className={styles.modalBotao}
                            onClick={() => {
                                handleBotaoPress();
                                setModalTempoAberto(false);
                            }}
                        >
                            Pronto
                        </button>
                    </div>
                </div>
            )}

            {/* S11/S12: Configurações de som e vibração */}
            <div className={styles.configuracoes}>
                <div className={styles.configItem}>
                    <label className={styles.configSwitch}>
                        <input
                            type="checkbox"
                            checked={somAtivo}
                            onChange={(e) => {
                                handleBotaoPress();
                                setSomAtivo(e.target.checked);
                            }}
                            className={styles.configInput}
                        />
                        <span className={styles.configSlider}></span>
                    </label>
                    <span className={styles.configLabel}>Som</span>
                </div>
                <div className={styles.configItem}>
                    <label className={styles.configSwitch}>
                        <input
                            type="checkbox"
                            checked={vibrar}
                            onChange={(e) => {
                                handleBotaoPress();
                                setVibrar(e.target.checked);
                            }}
                            className={styles.configInput}
                        />
                        <span className={styles.configSlider}></span>
                    </label>
                    <span className={styles.configLabel}>Vibração</span>
                </div>
            </div>
        </div>
    );
}

export default Cafeteira6;