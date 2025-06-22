import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// ======================
// Animaciones optimizadas
// ======================
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 8px 4px rgba(65, 105, 225, 0.2); }
  50% { transform: scale(1.02); box-shadow: 0 0 15px 8px rgba(70, 130, 180, 0.3); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
  50% { text-shadow: 0 0 10px rgba(176, 196, 222, 0.5); }
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
// Componentes estilizados optimizados
// ======================
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a3a 0%, #2a2a5a 50%, #1a1a3a 100%);
  color: #e6e6fa;
  font-family: 'Cormorant Garamond', 'Marcellus', serif;
  overflow-x: hidden;
  position: relative;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(70, 130, 180, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(70, 130, 180, 0.08) 0%, transparent 50%);
    opacity: 0.5;
    z-index: 1;
  }
`;

const MainContent = styled.div`
  padding: 2rem 1.5rem;
  max-width: 600px;
  margin: 1.5rem auto;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 60, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(70, 130, 180, 0.4);
  box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
  backdrop-filter: blur(6px);
  overflow: hidden;
  ${css`animation: ${curtainOpen} 1.2s ease-out forwards;`}

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
    ${css`animation: ${pulse} 10s infinite ease;`}
    z-index: -1;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    margin: 1rem;
    border-radius: 12px;
  }
`;

const AnimatedSection = styled.section`
  margin: 1.5rem 0;
  padding: 0.8rem;
  position: relative;

  @media (max-width: 480px) {
    margin: 1rem 0;
    padding: 0.5rem;
  }
`;

const InvitationText = styled(motion.h1)`
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, #e6e6fa, #b8b8d8, #e6e6fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  font-family: 'Marcellus', serif;
  ${css`animation: ${textGlow} 4s infinite ease;`}
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(to right, #b8b8d8, #8a8aba, #b8b8d8);
    border-radius: 2px;
    
    @media (max-width: 480px) {
      width: 60px;
      bottom: -6px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: clamp(2rem, 7vw, 2.8rem);
    margin-bottom: 0.8rem;
  }
`;

const NameText = styled(motion.h2)`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  margin: 1.2rem 0;
  color: #f0f0ff;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0.8rem 1.2rem;
  display: inline-block;
  border: 1px solid #8a8aba;
  border-radius: 40px;
  background: rgba(40, 40, 80, 0.6);
  box-shadow: 0 0 15px rgba(70, 130, 180, 0.2);
  ${css`
    animation: 
      ${float} 4s ease-in-out infinite,
      ${textGlow} 4s infinite ease;
  `}
  position: relative;
  overflow: hidden;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  
  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, transparent, rgba(176, 196, 222, 0.08), transparent);
    z-index: -1;
    ${css`animation: ${pulse} 8s infinite ease;`}
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.6rem, 5.5vw, 2.2rem);
    padding: 0.6rem 1rem;
    margin: 1rem 0;
  }
`;

const DetailsText = styled(motion.p)`
  font-size: clamp(1rem, 3.2vw, 1.3rem);
  margin: 0.8rem 0;
  color: #f0f0ff;
  font-weight: 400;
  background: rgba(40, 40, 80, 0.6);
  padding: 0.6rem 1rem;
  border-radius: 40px;
  display: inline-block;
  border: 1px solid #6a6a9a;
  box-shadow: 0 0 10px rgba(65, 105, 225, 0.15);
  position: relative;
  ${css`animation: ${textGlow} 4s infinite ease;`}
  line-height: 1.5;
  
  &::after {
    content: "❀";
    position: absolute;
    color: rgba(176, 196, 222, 0.6);
    ${css`animation: ${sparkle} 3s infinite ease;`}
    font-size: 1rem;
  }
  
  &:nth-child(odd)::after {
    top: -6px;
    right: -6px;
  }
  
  &:nth-child(even)::after {
    bottom: -6px;
    left: -6px;
  }
  
  @media (max-width: 480px) {
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
    padding: 0.5rem 0.8rem;
    margin: 0.6rem 0;
  }
`;

const Icon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.1rem;
  display: inline-block;
  color: #d8d8f0;
  ${css`animation: ${sparkle} 3s infinite ease;`}
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-right: 0.4rem;
  }
`;

const AcceptButton = styled(motion.button)`
  background: linear-gradient(to right, #8a8aba, #6a6a9a);
  color: #f8f8ff;
  border: none;
  padding: 0.8rem 1.8rem;
  font-size: 1.1rem;
  border-radius: 40px;
  cursor: pointer;
  margin: 1.2rem 0;
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.4);
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'Marcellus', serif;
  ${css`animation: ${textGlow} 4s infinite ease;`}
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #6a6a9a, #8a8aba);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(70, 130, 180, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    margin: 1rem 0;
  }
`;

const Sparkle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  ${css`animation: ${sparkle} 2s infinite ease;`}
  pointer-events: none;
  
  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
  }
`;

const FloatingCrown = styled.div`
  position: absolute;
  font-size: 1.5rem;
  color: rgba(184, 184, 216, 0.6);
  ${css`animation: ${float} 5s ease-in-out infinite;`}
  z-index: 1;
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Petal = styled.div`
  position: absolute;
  font-size: 1.2rem;
  color: rgba(184, 184, 216, 0.6);
  ${css`animation: ${petalFall} ${props => props.duration || '8'}s linear infinite;`}
  z-index: 1;
  pointer-events: none;
  animation-delay: ${props => props.delay || '0'}s;
  left: ${props => props.left || '0'}%;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Componente de Página de Celebración optimizado
const CelebrationMessage = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 40, 0.96);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 15px;
  text-align: center;
  backdrop-filter: blur(4px);
  overflow: hidden;
  font-family: 'Cormorant Garamond', 'Marcellus', serif;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(110, 130, 200, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(110, 130, 200, 0.08) 0%, transparent 50%);
    opacity: 0.3;
    z-index: 1;
  }
`;

const MessageContent = styled.div`
  padding: 2rem 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 60, 0.92);
  border-radius: 16px;
  border: 1px solid rgba(110, 130, 200, 0.4);
  box-shadow: 0 0 20px rgba(85, 105, 225, 0.3);
  backdrop-filter: blur(6px);
  overflow: hidden;
  ${css`animation: ${curtainOpen} 1.2s ease-out forwards;`}

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
    ${css`animation: ${pulse} 10s infinite ease;`}
    z-index: -1;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    margin: 0 1rem;
    border-radius: 12px;
  }
`;

const CelebrationTitle = styled.h2`
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, #f0e6ff, #d8b8f8, #f0e6ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  font-family: 'Marcellus', serif;
  ${css`animation: ${textGlow} 4s infinite ease;`}
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(to right, #d8b8f8, #b88af8, #d8b8f8);
    border-radius: 2px;
    
    @media (max-width: 480px) {
      width: 60px;
      bottom: -6px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: clamp(2rem, 7vw, 2.8rem);
    margin-bottom: 0.8rem;
  }
`;

const CelebrationText = styled.p`
  font-size: clamp(1rem, 3.2vw, 1.3rem);
  color: #f8f0ff;
  max-width: 500px;
  margin: 1.2rem auto;
  line-height: 1.6;
  ${css`animation: ${textGlow} 4s infinite ease;`}
  font-weight: 400;
  
  @media (max-width: 480px) {
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
    margin: 1rem auto;
  }
`;

const CelebrationButton = styled(motion.button)`
  background: linear-gradient(to right, #b88af8, #986af8);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 40px;
  cursor: pointer;
  margin-top: 1.2rem;
  box-shadow: 0 4px 12px rgba(152, 106, 248, 0.3);
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'Marcellus', serif;
  
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
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(152, 106, 248, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.8rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

// Componente de Página de Celebración optimizado
const CelebrationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [petals, setPetals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar pétalos (menos cantidad en móviles)
    const petalCount = window.innerWidth < 480 ? 6 : 10;
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 7,
      emoji: ['🌸', '🌹', '🌺', '🌻', '🌼'][Math.floor(Math.random() * 5)],
      size: `${0.5 + Math.random() * 0.5}rem`
    }));
    setPetals(newPetals);

    // Confetti inicial (menos cantidad y tiempo más corto en móviles)
    const confettiTime = window.innerWidth < 480 ? 2000 : 3500;
    const confettiPieces = window.innerWidth < 480 ? 80 : 150;
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, confettiTime);

    // Manejar redimensionamiento
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      // Recalcular pétalos al cambiar tamaño
      const newPetalCount = window.innerWidth < 480 ? 6 : 10;
      if (petals.length !== newPetalCount) {
        const updatedPetals = Array.from({ length: newPetalCount }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 5 + Math.random() * 7,
          emoji: ['🌸', '🌹', '🌺', '🌻', '🌼'][Math.floor(Math.random() * 5)],
          size: `${0.5 + Math.random() * 0.5}rem`
        }));
        setPetals(updatedPetals);
      }
    }, 150);

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMessage = () => {
    navigate('/', { state: { fromCelebration: true } });
  };

  return (
    <CelebrationMessage
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={window.innerWidth < 480 ? 80 : 150}
          gravity={window.innerWidth < 480 ? 0.25 : 0.15}
          colors={['#b8a8d8', '#9888c8', '#d8c8f8', '#a898e8']}
          style={{ zIndex: 0 }}
        />
      )}
      
      {petals.map(petal => (
        <Petal
          key={petal.id}
          left={petal.left}
          delay={petal.delay}
          duration={petal.duration}
          style={{ fontSize: petal.size }}
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
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Volver al Inicio
        </CelebrationButton>
      </MessageContent>
    </CelebrationMessage>
  );
};

// Función debounce optimizada
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Componente de Página Principal optimizado
const MainPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [sparkles, setSparkles] = useState([]);
  const [crowns, setCrowns] = useState([]);
  const navigate = useNavigate();

  // Observadores de intersección para animaciones
  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });

  useEffect(() => {
    // Cargar fuentes optimizadas
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Marcellus&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Manejar redimensionamiento
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Efecto de destellos optimizado
    const handleMouseMove = (e) => {
      if (Math.random() > 0.93) {
        setSparkles(prev => [
          ...prev.slice(-12),
          {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 3 + 2,
            delay: Math.random() * 1.5
          }
        ]);
      }
      
      // Coronas flotantes optimizadas
      if (Math.random() > 0.985) {
        setCrowns(prev => [
          ...prev.slice(-2),
          {
            id: Date.now(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight * 0.8,
            delay: Math.random() * 2,
            speed: Math.random() * 3 + 2
          }
        ]);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.head.removeChild(fontLink);
    };
  }, []);

  // Confetti inicial optimizado
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/celebration');
    }, 800);
  };

  return (
    <Container>
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={window.innerWidth < 480 ? 150 : 250}
            gravity={0.2}
            colors={['#8a8aba', '#6a6a9a', '#b8b8d8', '#9a9ac8']}
          />
        )}
      </AnimatePresence>

      {/* Efectos de destellos optimizados */}
      {sparkles.map(sparkle => (
        <Sparkle 
          key={sparkle.id}
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`
          }}
        />
      ))}
      
      {/* Coronas flotantes optimizadas */}
      {crowns.map(crown => (
        <FloatingCrown
          key={crown.id}
          style={{
            left: `${crown.x}px`,
            top: `${crown.y}px`,
            animation: `${float} ${crown.speed}s ease-in-out infinite`,
            animationDelay: `${crown.delay}s`,
            opacity: 0.6
          }}
        >
          ✨
        </FloatingCrown>
      ))}

      {/* Contenido principal optimizado */}
      <MainContent>
        <AnimatedSection ref={ref1}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: inView1 ? 1 : 0.8, y: inView1 ? 0 : 20 }}
            transition={{ duration: 0.7 }}
          >
            <InvitationText>¡Te invito a mis XV!</InvitationText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: inView2 ? 1 : 0.8, scale: inView2 ? 1 : 0.97 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <NameText>Estrella Jiménez Martínez</NameText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: inView3 ? 1 : 0.8, x: inView3 ? 0 : -15 }}
            transition={{ duration: 0.5 }}
          >
            <DetailsText>
              <Icon>⏰</Icon> Sábado 19 de Julio de 2025 a las 14:00 hrs
            </DetailsText>
            <DetailsText>
              <Icon>📍</Icon> Pueblo Nuevo Tlamimilolpan
            </DetailsText>
          </motion.div>
        </AnimatedSection>

        <AcceptButton
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAccept}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Aceptar Invitación
        </AcceptButton>
      </MainContent>
    </Container>
  );
};

// Componente App principal optimizado
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/celebration" element={<CelebrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;