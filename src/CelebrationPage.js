import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

// ======================
// Animaciones
// ======================
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px 5px rgba(65, 105, 225, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 0 20px 10px rgba(70, 130, 180, 0.5); }
  100% { transform: scale(1); box-shadow: 0 0 10px 5px rgba(65, 105, 225, 0.3); }
`;

const sparkle = keyframes`
  0% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); filter: brightness(1.5); }
  100% { opacity: 0.3; transform: scale(0.8); }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
  50% { text-shadow: 0 0 15px rgba(176, 196, 222, 0.7); }
  100% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
`;

const curtainOpen = keyframes`
  0% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
`;

const petalFall = keyframes`
  0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// ======================
// Componentes estilizados
// ======================
const CelebrationMessage = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 40, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(5px);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(110, 130, 200, 0.05)" d="M30,10 Q50,5 70,10 Q95,20 90,40 Q85,65 50,95 Q15,65 10,40 Q5,20 30,10 Z"/></svg>'),
      radial-gradient(circle at 20% 30%, rgba(110, 130, 200, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(110, 130, 200, 0.1) 0%, transparent 50%);
    opacity: 0.3;
    z-index: 1;
  }
`;

const MessageContent = styled.div`
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 60, 0.9);
  border-radius: 20px;
  border: 2px solid rgba(110, 130, 200, 0.5);
  box-shadow: 0 0 30px rgba(85, 105, 225, 0.4);
  backdrop-filter: blur(8px);
  overflow: hidden;
  ${css`animation: ${curtainOpen} 1.5s ease-out forwards;`}

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    ${css`animation: ${pulse} 8s infinite linear;`}
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
    border-radius: 15px;
    backdrop-filter: blur(5px);
  }
`;

const CelebrationTitle = styled.h2`
  font-size: clamp(2.5rem, 7vw, 4rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #d8b8f8, #b88af8, #986af8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  text-shadow: 0 0 15px rgba(180, 160, 220, 0.3);
  font-family: 'Playfair Display', serif;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #b88af8, #986af8, #b88af8);
    border-radius: 3px;
    
    @media (max-width: 768px) {
      width: 80px;
      bottom: -8px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: clamp(2.2rem, 8vw, 3rem);
    margin-bottom: 1rem;
  }
`;

const CelebrationText = styled.p`
  font-size: clamp(1.2rem, 3.5vw, 1.6rem);
  color: #f0e6ff;
  max-width: 600px;
  margin: 1.5rem auto;
  line-height: 1.6;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  
  @media (max-width: 768px) {
    font-size: clamp(1.1rem, 4vw, 1.4rem);
    margin: 1.2rem auto;
  }
`;

const CelebrationButton = styled(motion.button)`
  background: linear-gradient(to right, #b88af8, #986af8);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1.5rem;
  box-shadow: 0 5px 15px rgba(152, 106, 248, 0.4);
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #986af8, #b88af8);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(152, 106, 248, 0.6);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 2rem;
    font-size: 1.1rem;
    margin-top: 1.2rem;
  }
`;

const Petal = styled.div`
  position: absolute;
  font-size: 1.5rem;
  color: rgba(184, 184, 216, 0.7);
  ${css`animation: ${petalFall} ${props => props.duration || '10'}s linear infinite;`}
  z-index: 1;
  pointer-events: none;
  animation-delay: ${props => props.delay || '0'}s;
  left: ${props => props.left || '0'}%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// ======================
// Componente CelebrationPage
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
    // Cargar fuentes
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap';
    link1.rel = 'stylesheet';
    
    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap';
    link2.rel = 'stylesheet';
    
    document.head.appendChild(link1);
    document.head.appendChild(link2);

    // Configurar pétalos
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      emoji: ['🌸', '🌹', '🌺', '🌻', '🌼'][Math.floor(Math.random() * 5)]
    }));
    setPetals(newPetals);

    // Confetti inicial
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Manejar redimensionamiento
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMessage = () => {
    navigate('/'); // Redirigir a la página principal
  };

  return (
    <CelebrationMessage
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.15}
          colors={['#8a8aba', '#6a6a9a', '#b8b8d8', '#9a9ac8']}
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
          <br />
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

export default CelebrationPage;