import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';

// ======================
// Animaciones personalizadas
// ======================
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const twinkle = keyframes`
  0% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(0.9); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 15px 7px rgba(255, 105, 180, 0.6); }
  50% { box-shadow: 0 0 30px 15px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 15px 7px rgba(255, 105, 180, 0.6); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

// ======================
// Componentes estilizados
// ======================
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0033 0%, #3d0066 50%, #1a0033 100%);
  color: white;
  font-family: 'Montserrat', 'Arial', sans-serif;
  overflow-x: hidden;
  position: relative;
  padding: 10px;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const MainContent = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 40px rgba(255, 105, 180, 0.3);
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 10px;
    border-radius: 15px;
  }
`;

const AnimatedSection = styled.section`
  margin: 3rem 0;
  padding: 1rem;

  @media (max-width: 768px) {
    margin: 1.5rem 0;
    padding: 0.5rem;
  }
`;

const InvitationText = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: 2rem;
  background: linear-gradient(to right, #ff8a00, #ff4081, #da1b60);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  font-weight: 800;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #ff8a00, #ff4081, #da1b60);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const NameText = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 2rem 0;
  animation: ${float} 4s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(to right, #fff, #ffd700);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding: 0 20px;
  position: relative;
  
  &::before, &::after {
    content: '✧';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #ff4081;
    font-size: 1.5rem;
  }
  
  &::before {
    left: -5px;
  }
  
  &::after {
    right: -5px;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0;
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }
`;

const DetailsText = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  margin: 1.5rem 0;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  font-weight: 500;
  background: rgba(0, 0, 0, 0.4);
  padding: 12px 20px;
  border-radius: 50px;
  display: inline-block;
  border: 1px solid rgba(255, 215, 0, 0.3);

  @media (max-width: 768px) {
    padding: 10px 15px;
    margin: 1rem 0;
  }
`;

const Icon = styled.span`
  margin-right: 0.8rem;
  font-size: 1.5rem;
  display: inline-block;
  animation: ${bounce} 2s infinite;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: #ffd700;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StarsBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 105, 180, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 20%),
      url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    animation: ${twinkle} 5s infinite alternate;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd700' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M20 0l4 12h12l-10 8 4 12-10-8-10 8 4-12L4 12h12z'/%3E%3C/g%3E%3C/svg%3E");
    animation: ${twinkle} 3s infinite alternate-reverse;
  }
`;

const GifContainer = styled(motion.div)`
  position: relative;
  margin: 2rem auto;
  max-width: 90%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
  transform-style: preserve-3d;
  perspective: 1000px;

  @media (min-width: 768px) {
    max-width: 550px;
  }
`;

const GifImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 15px;
  border: 3px solid #ffd700;
  transition: all 0.5s ease;
  transform: translateZ(20px);
  
  &:hover {
    transform: scale(1.05) translateZ(30px);
    box-shadow: 0 0 50px rgba(255, 105, 180, 0.8);
  }
`;

const GifGlow = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 20px;
  animation: ${pulse} 4s infinite;
  pointer-events: none;
  z-index: -1;
`;

const MapContainer = styled(motion.div)`
  position: relative;
  margin: 2rem auto;
  max-width: 600px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(255, 105, 180, 0.4);
  border: 3px solid #ffd700;
  transform-style: preserve-3d;

  iframe {
    display: block;
    filter: grayscale(20%) contrast(110%) brightness(90%);
  }

  @media (max-width: 768px) {
    max-width: 90%;
    margin: 1.5rem auto;
  }
`;

const MapGlow = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 20px;
  animation: ${pulse} 5s infinite;
  pointer-events: none;
  z-index: -1;
`;

const FloatingHearts = () => {
  const hearts = Array(20).fill(0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
      {hearts.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 5 + Math.random() * 10;
        const size = Math.min(30, 15 + Math.random() * 20);
        const heartType = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '💖', '💗', '💘'][Math.floor(Math.random() * 10)];

        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '110%',
              fontSize: `${size}px`,
              color: ['#ff0000', '#ff69b4', '#ffd700', '#ffffff', '#ff4081'][Math.floor(Math.random() * 5)],
              zIndex: 1,
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))',
            }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: [window.innerHeight * -0.2, window.innerHeight + 100],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, Math.random() * 360],
              opacity: [0, 0.8, 1, 0.8, 0],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {heartType}
          </motion.div>
        );
      })}
    </div>
  );
};

const FloatingStars = () => {
  const stars = Array(15).fill(0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 8 + Math.random() * 15;
        const size = 8 + Math.random() * 15;

        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${size}px`,
              color: '#ffd700',
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✨
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHearts, setShowHearts] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Importar fuente de Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=Dancing+Script:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

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
    // Mostrar corazones inmediatamente
    setShowHearts(true);
    
    // Mostrar confeti después de 1 segundo
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000);

    // Ocultar confeti después de 10 segundos
    const hideConfettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(hideConfettiTimer);
    };
  }, []);

  const [ref1, inView1] = useInView({ threshold: 0.2, triggerOnce: false });
  const [ref2, inView2] = useInView({ threshold: 0.2, triggerOnce: false });
  const [refGif, inViewGif] = useInView({ threshold: 0.2, triggerOnce: false });
  const [ref3, inView3] = useInView({ threshold: 0.2, triggerOnce: false });
  const [ref4, inView4] = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <Container>
      {/* Corazones aparecen primero */}
      {showHearts && <FloatingHearts />}
      
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={600}
            gravity={0.1}
            colors={['#ff0000', '#ff69b4', '#ffd700', '#ffffff', '#ff4081']}
          />
        )}
      </AnimatePresence>

      <StarsBackground />
      <FloatingStars />

      <MainContent>
        <AnimatedSection ref={ref1} animate={inView1}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView1 ? 1 : 0.5, y: inView1 ? 0 : 30 }}
            transition={{ duration: 1, type: 'spring', delay: 0.5 }}
          >
            <InvitationText
              animate={{
                scale: inView1 ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              ¡Te invito a mis XV!
            </InvitationText>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref2} animate={inView2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: inView2 ? 1 : 0.7, scale: inView2 ? 1 : 0.9 }}
            transition={{ duration: 1, delay: 0.7, type: 'spring' }}
          >
            <NameText>Estrella Jiménez Martínez</NameText>
          </motion.div>
        </AnimatedSection>

        {/* Sección del GIF animado */}
        <AnimatedSection ref={refGif} animate={inViewGif}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ 
              opacity: inViewGif ? 1 : 0.7, 
              scale: inViewGif ? 1 : 0.9,
              y: inViewGif ? 0 : 15,
              rotate: inViewGif ? [0, 2, -2, 0] : 0
            }}
            transition={{ 
              duration: 1,
              rotate: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            <GifContainer
              whileHover={{ scale: 1.03 }}
            >
              <GifImage 
                src="https://media.tenor.com/_AZJmhAry0gAAAAj/rat-dancing-meme.gif" 
                alt="Celebración XV años"
              />
              <GifGlow />
            </GifContainer>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection ref={ref3} animate={inView3}>
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: inView3 ? 1 : 0.7, x: inView3 ? 0 : -30 }}
    transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
  >
    <DetailsText>
      <Icon>🏠</Icon> MI CASA<br/>
      <Icon>📍</Icon> 52055 Pueblo Nuevo Tlalmimilolpan, Méx.
    </DetailsText>
    
    
  </motion.div>
</AnimatedSection>

        <AnimatedSection ref={ref4} animate={inView4}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: inView4 ? 1 : 0.7, x: inView4 ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
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
              scale: [1, 1.1, 1],
              textShadow: ['0 0 10px rgba(255, 215, 0, 0.5)', '0 0 20px rgba(255, 105, 180, 0.8)', '0 0 10px rgba(255, 215, 0, 0.5)'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              background: 'linear-gradient(to right, #ffd700, #ff69b4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              padding: '0 15px',
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