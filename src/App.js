import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// ======================
// Animaciones
// ======================
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const sparkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
  50% { text-shadow: 0 0 10px rgba(176, 196, 222, 0.5); }
  100% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
`;

const curtainOpen = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const petalFall = keyframes`
  0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// ======================
// Componentes estilizados
// ======================
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a3a 0%, #2a2a5a 50%, #1a1a3a 100%);
  color: #e6e6fa;
  font-family: 'Cormorant Garamond', serif;
  overflow-x: hidden;
  position: relative;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const MainContent = styled.div`
  padding: 2rem 1.5rem;
  max-width: 600px;
  width: 90%;
  margin: 1rem auto;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 60, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(70, 130, 180, 0.4);
  box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
  backdrop-filter: blur(6px);
  ${css`animation: ${curtainOpen} 1s ease-out forwards;`}
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    width: 95%;
    max-width: 95%;
    border-radius: 12px;
    margin: 0.5rem auto;
  }

  @media (max-width: 360px) {
    padding: 1.2rem 0.8rem;
    width: 98%;
  }
`;

const AnimatedSection = styled.section`
  margin: 1.5rem 0;
  position: relative;

  @media (max-width: 480px) {
    margin: 1rem 0;
  }

  @media (max-width: 360px) {
    margin: 0.8rem 0;
  }
`;

const InvitationText = styled(motion.h1)`
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 1rem;
  color: #e6e6fa;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: 'Marcellus', serif;
  line-height: 1.2;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  word-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: clamp(1.8rem, 7vw, 2.5rem);
    margin-bottom: 0.8rem;
  }

  @media (max-width: 360px) {
    font-size: clamp(1.6rem, 7vw, 2.2rem);
  }
`;

const NameText = styled(motion.h2)`
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  margin: 1rem 0;
  color: #e6e6fa;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0.8rem 1.2rem;
  display: inline-block;
  border-bottom: 2px solid #8a8aba;
  font-style: italic;
  ${css`
    animation: 
      ${float} 3s ease-in-out infinite,
      ${textGlow} 3s infinite ease-in-out;
  `}
  word-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: clamp(1.4rem, 6vw, 2rem);
    padding: 0.6rem 1rem;
    margin: 0.8rem 0;
  }

  @media (max-width: 360px) {
    font-size: clamp(1.3rem, 6vw, 1.8rem);
    padding: 0.5rem 0.8rem;
  }
`;

const DetailsText = styled(motion.p)`
  font-size: clamp(1rem, 3.5vw, 1.2rem);
  margin: 0.8rem 0;
  color: #e6e6fa;
  font-weight: 400;
  padding: 0.6rem 1rem;
  line-height: 1.5;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  word-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: clamp(0.95rem, 4vw, 1.1rem);
    padding: 0.5rem 0.8rem;
    margin: 0.6rem 0;
  }

  @media (max-width: 360px) {
    font-size: clamp(0.9rem, 4vw, 1rem);
    padding: 0.4rem 0.6rem;
  }
`;

const Icon = styled.span`
  margin-right: 0.5rem;
  display: inline-block;
  ${css`animation: ${sparkle} 2s infinite ease-in-out;`}

  @media (max-width: 480px) {
    margin-right: 0.3rem;
  }
`;

const AcceptButton = styled(motion.button)`
  background: transparent;
  color: #e6e6fa;
  border: 1px solid #8a8aba;
  padding: 0.8rem 1.8rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  margin: 1.2rem 0;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  min-width: 200px;
  
  &:hover {
    background: rgba(70, 130, 180, 0.2);
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    margin: 1rem 0;
    min-width: 180px;
  }

  @media (max-width: 360px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    min-width: 160px;
  }
`;

const Sparkle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  ${css`animation: ${sparkle} 2s infinite ease-in-out;`}
  pointer-events: none;

  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
  }
`;

// Componente de Página de Celebración
const CelebrationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [sparkles, setSparkles] = useState([]);
  const navigate = useNavigate();

  // Observadores de intersección
  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Marcellus&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Efecto de destellos
    const handleMouseMove = (e) => {
      if (Math.random() > 0.95) {
        setSparkles(prev => [
          ...prev.slice(-10),
          {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 3 + 2,
            delay: Math.random() * 2
          }
        ]);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.head.removeChild(fontLink);
    };
  }, []);

  const closeMessage = () => {
    navigate('/', { state: { fromCelebration: true } });
  };

  return (
    <Container>
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={window.innerWidth < 480 ? 100 : 150}
            gravity={0.15}
            colors={['#b8a8d8', '#9888c8', '#d8c8f8', '#a898e8']}
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

      {/* Contenido principal */}
      <MainContent>
        <AnimatedSection ref={ref1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView1 ? 1 : 0.8, y: inView1 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
          >
            <InvitationText>¡Gracias por aceptar!</InvitationText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: inView3 ? 1 : 0.8, x: inView3 ? 0 : -10 }}
            transition={{ duration: 0.6 }}
          >
            <DetailsText>
              Tu presencia hará que mis XV Años sean aún más especiales.
            </DetailsText>
            <DetailsText>
              Estoy emocionada de compartir este día tan importante contigo.
            </DetailsText>
          </motion.div>
        </AnimatedSection>

        <AcceptButton
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={closeMessage}
        >
          Volver al Inicio
        </AcceptButton>
      </MainContent>
    </Container>
  );
};

// Componente de Página Principal
const MainPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [sparkles, setSparkles] = useState([]);
  const navigate = useNavigate();

  // Observadores de intersección
  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });

  useEffect(() => {
    // Cargar fuentes
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Marcellus&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);

    // Manejar redimensionamiento
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Efecto de destellos
    const handleMouseMove = (e) => {
      if (Math.random() > 0.95) {
        setSparkles(prev => [
          ...prev.slice(-10),
          {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 3 + 2,
            delay: Math.random() * 2
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
    }, 3000);
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
            numberOfPieces={window.innerWidth < 480 ? 100 : 150}
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

      {/* Contenido principal */}
      <MainContent>
        <AnimatedSection ref={ref1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView1 ? 1 : 0.8, y: inView1 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
          >
            <InvitationText>¡Te invito a mis XV!</InvitationText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: inView2 ? 1 : 0.8, scale: inView2 ? 1 : 0.98 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NameText>Estrella Jiménez Martínez</NameText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: inView3 ? 1 : 0.8, x: inView3 ? 0 : -10 }}
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
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAccept}
        >
          Aceptar Invitación
        </AcceptButton>
      </MainContent>
    </Container>
  );
};

// Componente App principal
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