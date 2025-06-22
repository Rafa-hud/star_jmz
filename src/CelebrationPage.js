import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

// ======================
// Animaciones optimizadas
// ======================
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.03); opacity: 1; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
  50% { text-shadow: 0 0 15px rgba(176, 196, 222, 0.7); }
`;

const curtainOpen = keyframes`
  from { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
  to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
`;

const petalFall = keyframes`
  0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// ======================
// Componentes estilizados responsive
// ======================
const CelebrationMessage = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 15, 40, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(5px);
  overflow: hidden;
  box-sizing: border-box;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(110, 130, 200, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(110, 130, 200, 0.1) 0%, transparent 50%);
    opacity: 0.3;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    justify-content: flex-start;
    padding-top: 10vh;
  }

  @media (max-width: 480px) {
    padding-top: 8vh;
  }
`;

const MessageContent = styled.div`
  padding: 2.5rem 2rem;
  width: 85%;
  max-width: 550px;
  margin: 0 0 0 5%;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 60, 0.95);
  border-radius: 20px;
  border: 2px solid rgba(110, 130, 200, 0.5);
  box-shadow: 0 0 30px rgba(85, 105, 225, 0.4);
  backdrop-filter: blur(10px);
  overflow: hidden;
  animation: ${curtainOpen} 1s ease-out forwards;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    animation: ${pulse} 8s infinite linear;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    width: 85%;
    max-width: 85%;
    margin: 0 0 0 5%;
    border-radius: 18px;
    backdrop-filter: blur(8px);
  }

  @media (max-width: 480px) {
    padding: 1.8rem 1.2rem;
    width: 88%;
    max-width: 88%;
    margin: 0 0 0 5%;
    border-radius: 16px;
  }

  @media (max-width: 375px) {
    padding: 1.5rem 1rem;
    width: 90%;
    max-width: 90%;
    margin: 0 0 0 3%;
  }
`;

const CelebrationTitle = styled.h2`
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  margin-bottom: 1.2rem;
  background: linear-gradient(to right, #d8b8f8, #b88af8, #986af8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  text-shadow: 0 0 10px rgba(180, 160, 220, 0.3);
  font-family: 'Playfair Display', serif;
  animation: ${textGlow} 3s infinite ease-in-out;
  line-height: 1.2;
  width: 100%;
  text-align: left;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 80px;
    height: 2px;
    background: linear-gradient(to right, #b88af8, #986af8, #b88af8);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: clamp(1.6rem, 7vw, 2.4rem);
    margin-bottom: 1rem;
    
    &::after {
      width: 70px;
      bottom: -6px;
    }
  }

  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 8vw, 2rem);
    margin-bottom: 0.8rem;
    
    &::after {
      width: 60px;
    }
  }
`;

const CelebrationText = styled.p`
  font-size: clamp(1rem, 3.2vw, 1.25rem);
  color: #f0e6ff;
  width: 100%;
  margin: 0.8rem 0;
  line-height: 1.5;
  animation: ${textGlow} 3s infinite ease-in-out;
  text-align: left;
  
  @media (max-width: 768px) {
    font-size: clamp(0.95rem, 4vw, 1.1rem);
    margin: 0.7rem 0;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.9rem, 4.5vw, 1rem);
    margin: 0.6rem 0;
  }
`;

const CelebrationButton = styled(motion.button)`
  background: linear-gradient(to right, #b88af8, #986af8);
  color: white;
  border: none;
  padding: 0.9rem 2.2rem;
  font-size: clamp(1rem, 3vw, 1.1rem);
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1.2rem;
  box-shadow: 0 4px 12px rgba(152, 106, 248, 0.4);
  transition: all 0.2s ease;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  min-width: 180px;
  align-self: center;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #986af8, #b88af8);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(152, 106, 248, 0.6);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    margin-top: 1rem;
    min-width: 170px;
    font-size: clamp(0.95rem, 3.5vw, 1.05rem);
  }

  @media (max-width: 480px) {
    padding: 0.7rem 1.8rem;
    min-width: 160px;
    margin-top: 0.8rem;
  }
`;

const Petal = styled.div`
  position: absolute;
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: rgba(184, 184, 216, 0.7);
  animation: ${petalFall} ${props => props.duration || '8'}s linear infinite;
  z-index: 1;
  pointer-events: none;
  animation-delay: ${props => props.delay || '0'}s;
  left: ${props => props.left || '0'}%;
  will-change: transform;
`;

// ======================
// Componente CelebrationPage optimizado
// ======================
const CelebrationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [petals, setPetals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar fuentes de manera eficiente
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Playfair+Display:wght@700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Configurar pétalos con cantidad dinámica según tamaño de pantalla
    const petalCount = window.innerWidth < 768 ? 12 : 18;
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      emoji: ['🌸', '🌹', '🌺', '🌻', '🌼'][Math.floor(Math.random() * 5)]
    }));
    setPetals(newPetals);

    // Confetti optimizado para dispositivos móviles
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, window.innerWidth < 768 ? 3500 : 6000);

    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(confettiTimer);
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(fontLink);
    };
  }, []);

  const closeMessage = () => {
    navigate('/');
  };

  return (
    <CelebrationMessage
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={windowSize.width < 768 ? 180 : 280}
          gravity={windowSize.width < 768 ? 0.25 : 0.12}
          colors={['#8a8aba', '#6a6a9a', '#b8b8d8', '#9a9ac8']}
          style={{ position: 'fixed' }}
        />
      )}
      
      {petals.map(petal => (
        <Petal
          key={petal.id}
          left={petal.left}
          delay={petal.delay}
          duration={petal.duration}
        >
          {petal.emoji}
        </Petal>
      ))}
      
      <MessageContent>
        <CelebrationTitle>¡Gracias por aceptar!</CelebrationTitle>
        <CelebrationText>
          Tu presencia hará que mis XV Años sean aún más especiales.
        </CelebrationText>
        <CelebrationText>
          Estoy emocionada de compartir este día tan importante contigo.
        </CelebrationText>
        <CelebrationButton 
          onClick={closeMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver
        </CelebrationButton>
      </MessageContent>
    </CelebrationMessage>
  );
};

// Helper para debounce
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export default CelebrationPage;