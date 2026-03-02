import React, { useState } from "react";

import "./Ruleta.css"; // Importa el archivo de estilos CSS
import centro from "./images/centro.png";
import ruleta from "./images/ruleta.png"; // Importa la imagen de la ruleta
import logo from "./images/logo.png"; // Importa el logo

function Ruleta({ onResult }) {

  // Estado para controlar la visibilidad de la imagen y el número de la casilla
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [numeroCasilla] = useState(null);

  // Estado para controlar el premio actual
  const [premio, setPremio] = useState("Suerte!");

  // Estado para controlar la rotación de la ruleta
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Configuración de probabilidades y textos por sector (1 al 8)
  // 'prob' determina el peso de cada sector (el sistema calculará la probabilidad real en base a la suma total) y 'texto' (el premio a mostrar)
  const sectores = [
  { id: 1, prob: 3,  centro: 22,  texto: "Merchandising premium" },
  { id: 2, prob: 8,  centro: 67,  texto: "Gracias por participar" },
  { id: 3, prob: 25, centro: 112, texto: "Kit de Cuaderno y lapicera" },
  { id: 4, prob: 7,  centro: 157, texto: "Tirá de nuevo" },
  { id: 5, prob: 32, centro: 202, texto: "Cupón de comida" },
  { id: 6, prob: 8,  centro: 247, texto: "Gracias por participar" },
  { id: 7, prob: 10, centro: 292, texto: "Botellita de agua" },
  { id: 8, prob: 7,  centro: 337, texto: "Tirá de nuevo" },
  ];

  // Función para realizar la rotación de la ruleta basada en probabilidades
  const girar = () => {
    // 1. Selección de sector por peso
    const totalProb = sectores.reduce((suma, s) => suma + s.prob, 0);
    let random = Math.random() * totalProb;
    let acumulado = 0;
    let sectorSeleccionado = sectores[sectores.length - 1];

    for (let s of sectores) {
      acumulado += s.prob;
      if (random <= acumulado) {
        sectorSeleccionado = s;
        break;
      }
    }

    // 2. Cálculo del ángulo
    // Offset para que no caiga siempre exacto en el mismo punto del sector
    const offset = Math.floor(Math.random() * 30) - 15;
    const targetGrados = sectorSeleccionado.centro + offset;

    // 3. Rotación final (asegurando 5 vueltas mínimas)
    const vueltas = 5;
    const destinoFinal = (Math.ceil(rotation / 360) * 360) + (vueltas * 360) + targetGrados;
    
    setRotation(destinoFinal);
  };

  // Función ejecutada al finalizar la animación
  const final = () => {
    // Obtener en qué sector cayó realmente (normalizado a 0-359)
    const gradosFinales = ((rotation % 360) + 360) % 360;
    
    // Encontrar el sector más cercano al grado final
    const sectorReal = sectores.find(s => 
      gradosFinales >= s.centro - 22 && gradosFinales <= s.centro + 22
    ) || sectores[0]; // Fallback al primer sector

    const nuevoPremio = sectorReal.texto;
    setPremio(nuevoPremio);

    // Notificar al componente padre del resultado
    if (onResult) {
      onResult(nuevoPremio);
    }

    setIsSpinning(false);

    // Restaurar texto después de 2 segundos
    setTimeout(() => {
      setPremio("Suerte!");
    }, 4000);
  };


  // Función para manejar el evento de clic para lanzar la ruleta
  const lanzar = () => {
    if (isSpinning) return; // Evita que se dispare múltiples veces al girar
    setIsSpinning(true);
    setMostrarImagen(false);
    girar();
  };

  // Función para manejar el evento de clic en el botón de regresar
  const handleRegresar = () => {
    window.location.reload(); // Recargar para volver al inicio limpiamente
  };


  return (
    <div className="plafon">
      <img src={logo} alt="Logo" className="ruleta-logo" />
      <div className="ruleta-wrapper">
        {/* Elemento de la ruleta */}
        <div
          className="ruleta"
          style={{
            backgroundImage: `url(${ruleta})`, // Aquí se referencia la imagen de la ruleta
            transform: `rotate(${rotation}deg)`,
            transition: "transform 4s cubic-bezier(0.2, 1.2, 1.0, 0.99)",
            filter: mostrarImagen ? "blur(5px)" : "none",
            cursor: isSpinning ? "default" : "pointer"
          }}
          onClick={lanzar}
          onTransitionEnd={final}
        ></div>

        {/* Elemento central con imagen */}
        <div className="central" onClick={lanzar} style={{ cursor: isSpinning ? "default" : "pointer" }}>
          <img
            src={centro}
            alt="centro"
            style={{ filter: mostrarImagen ? "blur(5px)" : "none", pointerEvents: "none" }}
          />
        </div>
      </div>

      {/* Contenedor de la imagen de la casilla */}
      <div className="imagen-casilla-container">
        {/* Mostrar la imagen de la casilla si está activa */}
        {mostrarImagen && numeroCasilla && (
          <div className="imagen-casilla">
            <img
              src={`./${numeroCasilla}.png`}
              alt={`Casilla ${numeroCasilla}`}
            />
          </div>
        )}
      </div>

      {/* Elemento para mostrar el premio actual */}
      <div className="premio">{premio}</div>

      {/* Barra inferior con el botón de regresar */}
      <div className="barraInferior">
        <button className="BotonRegresar" onClick={handleRegresar}>
          Regresar
        </button>
      </div>
    </div>
  );
}

export default Ruleta;
