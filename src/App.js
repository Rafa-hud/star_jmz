import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';

// ======================
// Animaciones mejoradas
// ======================
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.02); box-shadow: 0 0 25px 10px rgba(255, 105, 180, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.5); }
`;

const sparkle = keyframes`
  0% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(0.8); }
`;

// ======================
// Componentes estilizados
// ======================
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2b0a3a 0%, #4a1b6a 50%, #2b0a3a 100%);
  color: white;
  font-family: 'Playfair Display', 'Montserrat', serif;
  overflow-x: hidden;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainContent = styled.div`
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(43, 10, 58, 0.85);
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 40px rgba(255, 105, 180, 0.4);
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin: 1rem auto;
  }
`;

const AnimatedSection = styled.section`
  margin: 2.5rem 0;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    margin: 1.8rem 0;
  }
`;

const InvitationText = styled(motion.h1)`
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #ffd700, #ff69b4, #ff8a00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 2px;
  position: relative;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  font-style: italic;
  
  &::before, &::after {
    content: '✧';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #ffd700;
    font-size: 2rem;
    animation: ${sparkle} 2s infinite;
  }
  
  &::before {
    left: -30px;
  }
  
  &::after {
    right: -30px;
  }

  @media (max-width: 768px) {
    &::before, &::after {
      font-size: 1.5rem;
    }
  }
`;

const NameText = styled(motion.h2)`
  font-size: clamp(2.2rem, 5.5vw, 3.5rem);
  margin: 2rem 0;
  color: #fff;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 1rem 2rem;
  display: inline-block;
  border: 2px solid #ffd700;
  border-radius: 50px;
  background: rgba(107, 36, 138, 0.4);
  box-shadow: 0 0 25px rgba(255, 105, 180, 0.3);
  animation: ${float} 4s ease-in-out infinite;
  position: relative;
  z-index: 1;
`;

const DetailsText = styled(motion.p)`
  font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  margin: 1.8rem 0;
  color: #fff;
  font-weight: 400;
  background: rgba(74, 27, 106, 0.6);
  padding: 1.2rem 2.2rem;
  border-radius: 50px;
  display: inline-block;
  border: 1px solid #ff69b4;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.2);
  position: relative;
  z-index: 1;
`;

const Icon = styled.span`
  margin-right: 0.8rem;
  font-size: 1.5rem;
  display: inline-block;
  color: #ffd700;
  animation: ${sparkle} 2s infinite;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  color: #ffd700;
  position: relative;
  z-index: 1;
`;

const MapContainer = styled(motion.div)`
  position: relative;
  margin: 2.5rem auto;
  max-width: 600px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
  border: 2px solid #ffd700;
  transform-style: preserve-3d;
  z-index: 1;

  iframe {
    display: block;
    filter: brightness(110%) contrast(110%) saturate(120%);
  }

  @media (max-width: 768px) {
    max-width: 95%;
    margin: 1.8rem auto;
  }
`;

const MapGlow = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 15px;
  animation: ${pulse} 3s infinite;
  pointer-events: none;
  z-index: -1;
`;

const FloatingCrowns = () => {
  const crowns = Array(8).fill(0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {crowns.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 10 + Math.random() * 15;
        const size = 20 + Math.random() * 30;

        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${size}px`,
              color: '#ffd700',
              opacity: 0.6,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 15, 0],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            👑
          </motion.div>
        );
      })}
    </div>
  );
};

// ======================
// Componente principal
// ======================
const App = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Importar fuentes de Google Fonts
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap';
    link1.rel = 'stylesheet';
    
    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap';
    link2.rel = 'stylesheet';
    
    document.head.appendChild(link1);
    document.head.appendChild(link2);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });
  const [ref4, inView4] = useInView({ threshold: 0.1 });

  return (
    <Container>
      <FloatingCrowns />
      
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={['#ffd700', '#ff69b4', '#ffffff', '#ff8a00']}
          />
        )}
      </AnimatePresence>

      <MainContent>
        <AnimatedSection ref={ref1}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView1 ? 1 : 0.8, y: inView1 ? 0 : 30 }}
            transition={{ duration: 1, type: 'spring' }}
          >
            <InvitationText>¡Te invito a mis XV!</InvitationText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: inView2 ? 1 : 0.8, scale: inView2 ? 1 : 0.95 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
          >
            <NameText>Estrella Jiménez Martínez</NameText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref3}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: inView3 ? 1 : 0.8, x: inView3 ? 0 : -20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <DetailsText>
              <Icon>📍</Icon> 52055 Pueblo Nuevo Tlalmimilolpan, Méx.
            </DetailsText>
            
            <MapContainer 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: inView3 ? 1 : 0.8, scale: inView3 ? 1 : 0.97 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.112245593614!2d-99.4767877!3d19.5101583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d20d9e9e9e9e9e%3A0x9e9e9e9e9e9e9e9e!2s52055%20Pueblo%20Nuevo%20Tlalmimilolpan!5e0!3m2!1sen!2smx!4v1620000000000!5m2!1sen!2smx"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ubicación de la fiesta de XV Años"
              ></iframe>
              <MapGlow />
            </MapContainer>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref4}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: inView4 ? 1 : 0.8, x: inView4 ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <DetailsText>
              <Icon>⏰</Icon> Sábado 19 de Julio de 2025 a las 14:00 hrs
            </DetailsText>
          </motion.div>
        </AnimatedSection>
      </MainContent>

      <Footer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.p
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              background: 'linear-gradient(to right, #ffd700, #ff69b4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              padding: '0 20px',
            }}
          >
            ¡Espero contar con tu presencia!
          </motion.p>
        </motion.div>
      </Footer>
    </Container>
  );
};

export default App;