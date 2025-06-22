import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

// Animaciones optimizadas
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.02); opacity: 1; }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
  50% { text-shadow: 0 0 12px rgba(176, 196, 222, 0.6); }
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

// Componentes estilizados
const CelebrationMessage = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 15, 40, 0.98);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 15vh;
  }
`;

const MessageContent = styled.div`
  padding: 2rem;
  width: 80%;
  max-width: 480px;
  position: relative;
  background: rgba(25, 25, 60, 0.97);
  border-radius: 16px;
  border: 1.5px solid rgba(110, 130, 200, 0.6);
  box-shadow: 0 0 25px rgba(85, 105, 225, 0.5);
  backdrop-filter: blur(8px);
  animation: ${curtainOpen} 0.8s ease-out forwards;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-left: 8%;

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
    animation: ${pulse} 10s infinite linear;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 1.6rem;
    width: 85%;
    max-width: 85%;
    margin-left: 6%;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 1.4rem 1.2rem;
    width: 88%;
    max-width: 88%;
    margin-left: 5%;
    border-radius: 12px;
    border-width: 1px;
  }
`;

const CelebrationTitle = styled.h2`
  font-size: clamp(1.6rem, 5.5vw, 2.4rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, #d8b8f8, #b88af8, #986af8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  position: relative;
  font-family: 'Playfair Display', serif;
  animation: ${textGlow} 3s infinite ease-in-out;
  line-height: 1.2;
  width: 100%;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 70px;
    height: 2px;
    background: linear-gradient(to right, #b88af8, #986af8);
    border-radius: 2px;
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.4rem, 6vw, 1.8rem);
    margin-bottom: 0.8rem;
    
    &::after {
      width: 60px;
      bottom: -5px;
    }
  }
`;

const CelebrationText = styled.p`
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: #f0e6ff;
  width: 100%;
  margin: 0.7rem 0;
  line-height: 1.5;
  animation: ${textGlow} 3s infinite ease-in-out;
  
  @media (max-width: 480px) {
    font-size: clamp(0.85rem, 3.8vw, 0.95rem);
    margin: 0.6rem 0;
  }
`;

const CelebrationButton = styled(motion.button)`
  background: linear-gradient(to right, #b88af8, #986af8);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: clamp(0.95rem, 3vw, 1.05rem);
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 3px 10px rgba(152, 106, 248, 0.4);
  transition: all 0.2s ease;
  font-weight: 600;
  align-self: center;
  min-width: 160px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 14px rgba(152, 106, 248, 0.6);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.8rem;
    min-width: 150px;
    font-size: clamp(0.9rem, 3.5vw, 1rem);
    margin-top: 0.8rem;
  }
`;

const Petal = styled.div`
  position: absolute;
  font-size: clamp(0.9rem, 2.8vw, 1.3rem);
  color: rgba(184, 184, 216, 0.6);
  animation: ${petalFall} ${props => props.duration || '8'}s linear infinite;
  z-index: 1;
  pointer-events: none;
  animation-delay: ${props => props.delay || '0'}s;
  left: ${props => props.left || '0'}%;
`;

// Componente principal
const CelebrationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [petals, setPetals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Playfair+Display:wght@700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const petalCount = window.innerWidth < 768 ? 10 : 15;
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      emoji: ['🌸', '🌹', '🌺', '🌻', '🌼'][Math.floor(Math.random() * 5)]
    }));
    setPetals(newPetals);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, window.innerWidth < 768 ? 3000 : 5000);

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

  return (
    <CelebrationMessage
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={windowSize.width < 768 ? 150 : 250}
          gravity={windowSize.width < 768 ? 0.3 : 0.15}
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
        </CelebrationText>
        <CelebrationText>
          Estoy emocionada de compartir este día tan importante contigo.
        </CelebrationText>
        <CelebrationButton 
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver
        </CelebrationButton>
      </MessageContent>
    </CelebrationMessage>
  );
};

function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default CelebrationPage;