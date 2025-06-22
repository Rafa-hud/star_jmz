import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// ======================
// Animaciones (compartidas)
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
// Componentes estilizados (compartidos)
// ======================
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a3a 0%, #2a2a5a 50%, #1a1a3a 100%);
  color: #e6e6fa;
  font-family: 'Playfair Display', 'Montserrat', sans-serif;
  overflow-x: hidden;
  position: relative;
  padding: 20px;
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
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(70, 130, 180, 0.05)" d="M30,10 Q50,5 70,10 Q95,20 90,40 Q85,65 50,95 Q15,65 10,40 Q5,20 30,10 Z"/></svg>'),
      radial-gradient(circle at 20% 30%, rgba(70, 130, 180, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(70, 130, 180, 0.1) 0%, transparent 50%);
    opacity: 0.5;
    z-index: 1;
  }
`;

const MainContent = styled.div`
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 60, 0.85);
  border-radius: 20px;
  border: 2px solid rgba(70, 130, 180, 0.5);
  box-shadow: 0 0 30px rgba(65, 105, 225, 0.4);
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
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 15px;
    backdrop-filter: blur(5px);
  }
`;

const AnimatedSection = styled.section`
  margin: 2rem 0;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    margin: 1rem 0;
    padding: 0.5rem;
  }
`;

const InvitationText = styled(motion.h1)`
  font-size: clamp(2.5rem, 7vw, 4rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #b8b8d8, #8a8aba, #6a6a9a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  text-shadow: 0 0 15px rgba(176, 196, 222, 0.3);
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
    background: linear-gradient(to right, #8a8aba, #6a6a9a, #8a8aba);
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

const NameText = styled(motion.h2)`
  font-size: clamp(2rem, 5.5vw, 3rem);
  margin: 1.5rem 0;
  color: #e6e6fa;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 1rem 1.5rem;
  display: inline-block;
  border: 2px solid #8a8aba;
  border-radius: 50px;
  background: rgba(40, 40, 80, 0.7);
  box-shadow: 0 0 20px rgba(70, 130, 180, 0.3);
  ${css`
    animation: 
      ${float} 3s ease-in-out infinite,
      ${textGlow} 3s infinite ease-in-out;
  `}
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, transparent, rgba(176, 196, 222, 0.1), transparent);
    z-index: -1;
    ${css`animation: ${pulse} 6s infinite linear;`}
  }
  
  @media (max-width: 768px) {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
    padding: 0.8rem 1.2rem;
    margin: 1rem 0;
  }
`;

const DetailsText = styled(motion.p)`
  font-size: clamp(1.1rem, 3.5vw, 1.5rem);
  margin: 1rem 0;
  color: #e6e6fa;
  font-weight: 500;
  background: rgba(40, 40, 80, 0.7);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  display: inline-block;
  border: 1px solid #6a6a9a;
  box-shadow: 0 0 15px rgba(65, 105, 225, 0.2);
  position: relative;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  
  &::after {
    content: "✦";
    position: absolute;
    color: rgba(176, 196, 222, 0.7);
    ${css`animation: ${sparkle} 2s infinite ease-in-out;`}
    font-size: 1.2rem;
  }
  
  &:nth-child(odd)::after {
    top: -8px;
    right: -8px;
  }
  
  &:nth-child(even)::after {
    bottom: -8px;
    left: -8px;
  }
  
  @media (max-width: 768px) {
    font-size: clamp(1rem, 4vw, 1.3rem);
    padding: 0.6rem 1rem;
    margin: 0.8rem 0;
  }
`;

const Icon = styled.span`
  margin-right: 0.6rem;
  font-size: 1.3rem;
  display: inline-block;
  color: #b8b8d8;
  text-shadow: 0 0 5px rgba(176, 196, 222, 0.5);
  ${css`animation: ${sparkle} 2s infinite ease-in-out;`}
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-right: 0.5rem;
  }
`;

const AcceptButton = styled(motion.button)`
  background: linear-gradient(to right, #8a8aba, #6a6a9a);
  color: #e6e6fa;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.3rem;
  border-radius: 50px;
  cursor: pointer;
  margin: 1.5rem 0;
  box-shadow: 0 5px 15px rgba(70, 130, 180, 0.5);
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  
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
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(70, 130, 180, 0.7);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    margin: 1rem 0;
  }
`;

const Sparkle = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  ${css`animation: ${sparkle} 2s infinite ease-in-out;`}
  pointer-events: none;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
  
  @media (max-width: 768px) {
    width: 4px;
    height: 4px;
  }
`;

const FloatingCrown = styled.div`
  position: absolute;
  font-size: 2rem;
  color: rgba(184, 184, 216, 0.7);
  ${css`animation: ${float} 4s ease-in-out infinite;`}
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
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

// Componentes específicos para la página de celebración
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

// ======================
// Componente de Página de Celebración
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

// ======================
// Componente de Página Principal
// ======================
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
    // Cargar fuentes
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap';
    link1.rel = 'stylesheet';
    
    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap';
    link2.rel = 'stylesheet';
    
    document.head.appendChild(link1);
    document.head.appendChild(link2);

    // Manejar redimensionamiento
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Efecto de destellos al mover el mouse
    const handleMouseMove = (e) => {
      // Destellos
      if (Math.random() > 0.92) {
        setSparkles(prev => [
          ...prev.slice(-15),
          {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 4 + 3,
            delay: Math.random() * 2
          }
        ]);
      }
      
      // Coronas flotantes (aparecen con menos frecuencia)
      if (Math.random() > 0.98) {
        setCrowns(prev => [
          ...prev.slice(-3),
          {
            id: Date.now(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight * 0.8,
            delay: Math.random() * 3,
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
    };
  }, []);

  // Confetti inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/celebration'); // Navegar a la nueva página
    }, 1000);
  };

  return (
    <Container>
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Efectos de destellos */}
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
      
      {/* Coronas flotantes */}
      {crowns.map(crown => (
        <FloatingCrown
          key={crown.id}
          style={{
            left: `${crown.x}px`,
            top: `${crown.y}px`,
            animation: `${float} ${crown.speed}s ease-in-out infinite`,
            animationDelay: `${crown.delay}s`,
            opacity: 0.7
          }}
        >
          👑
        </FloatingCrown>
      ))}

      {/* Contenido principal */}
      <MainContent>
        <AnimatedSection ref={ref1}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView1 ? 1 : 0.8, y: inView1 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <InvitationText>¡Te invito a mis XV!</InvitationText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: inView2 ? 1 : 0.8, scale: inView2 ? 1 : 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <NameText>Estrella Jiménez Martínez</NameText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref3}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: inView3 ? 1 : 0.8, x: inView3 ? 0 : -20 }}
            transition={{ duration: 0.6 }}
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAccept}
        >
          Aceptar Invitación
        </AcceptButton>
      </MainContent>
    </Container>
  );
};

// ======================
// Componente App principal
// ======================
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