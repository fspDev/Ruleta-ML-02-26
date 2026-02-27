import React, { useState } from 'react';
import './App.css';
import Trivia from './Trivia';
import Ruleta from './Ruleta';
import logo from './images/logo.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [formData, setFormData] = useState({ nombre: '', email: '', empresa: '' });
  const [currentParticipantId, setCurrentParticipantId] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email && formData.empresa) {
      const participantId = Date.now(); // ID único para este registro
      const newParticipant = { 
        id: participantId,
        ...formData, 
        fecha: new Date().toLocaleString(),
        resultado: 'Pendiente' // Se actualizará al girar la ruleta
      };

      // 1. Guardar en Electron (si está disponible)
      if (window.electronAPI) {
        window.electronAPI.saveParticipant(formData);
      }

      // 2. Guardar en localStorage
      const existingData = JSON.parse(localStorage.getItem('participantes') || '[]');
      existingData.push(newParticipant);
      localStorage.setItem('participantes', JSON.stringify(existingData));

      setCurrentParticipantId(participantId);
      setCurrentPage('ruleta');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const updateResult = (resultado) => {
    const data = JSON.parse(localStorage.getItem('participantes') || '[]');
    const index = data.findIndex(p => p.id === currentParticipantId);
    if (index !== -1) {
      data[index].resultado = resultado;
      localStorage.setItem('participantes', JSON.stringify(existingData => {
         // Esta parte es solo ilustrativa, la lógica real está debajo
      }));
      // Lógica real de actualización
      localStorage.setItem('participantes', JSON.stringify(data));
    }
  };


  const downloadCSV = () => {
    const data = JSON.parse(localStorage.getItem('participantes') || '[]');
    if (data.length === 0) {
      alert('No hay participantes registrados en el navegador aún.');
      return;
    }

    // Cabeceras del CSV
    const headers = ['Nombre', 'Email', 'Empresa', 'Fecha', 'Resultado'];
    
    // Contenido del CSV
    const csvContent = [
      headers.join(';'),
      ...data.map(row => `${row.nombre};${row.email};${row.empresa};${row.fecha};${row.resultado || 'N/A'}`)
    ].join('\n');


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `participantes_ruleta_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'trivia':
        return <Trivia />;
      case 'ruleta':
        return <Ruleta onResult={updateResult} />;

      case 'registration':
        return (
          <div className="registration-container">
            <h2>Registro de Participante</h2>
            <form onSubmit={handleFormSubmit} className="registration-form">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="empresa"
                placeholder="Empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="Ruleta">ENTRAR A LA RULETA</button>
            </form>
          </div>
        );
      default:
        return (
          <div className="App-home">
            <img 
              src={logo} 
              className="App-logo" 
              alt="logo" 
              onClick={() => setIsPlayingVideo(true)}
              style={{ cursor: 'pointer' }}
            />
            {isPlayingVideo && (
              <div className="video-overlay" onClick={() => setIsPlayingVideo(false)}>
                <div className="video-container" onClick={(e) => e.stopPropagation()}>
                  <video controls autoPlay loop className="main-video">
                    <source src="./video.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                  <button className="close-video" onClick={() => setIsPlayingVideo(false)}>✕</button>
                </div>
              </div>
            )}
            <div>
              <button className='Ruleta' onClick={() => setCurrentPage('ruleta')}>JUGAR</button>
            </div>
            {/* Ocultado temporalmente por pedido del usuario
            <button className="download-btn" onClick={downloadCSV}>
              Lista
            </button>
            */}
          </div>
        );
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        {renderPage()}
      </header>
    </div>
  );
}

export default App;
