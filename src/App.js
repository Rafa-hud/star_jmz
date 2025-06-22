import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import ReactConfetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';

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
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(0.8); }
`;

// ======================
// Componentes estilizados
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
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(70, 130, 180, 0.05)" d="M30,10 Q50,5 70,10 Q95,20 90,40 Q85,65 50,95 Q15,65 10,40 Q5,20 30,10 Z"/></svg>');
    opacity: 0.3;
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
  background: rgba(25, 25, 60, 0.8);
  border-radius: 20px;
  border: 2px solid rgba(70, 130, 180, 0.5);
  box-shadow: 0 0 30px rgba(65, 105, 225, 0.4);
  backdrop-filter: blur(5px);
  overflow: hidden;

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
    padding: 2rem 1rem;
    margin: 1rem auto;
  }
`;

const AnimatedSection = styled.section`
  margin: 2rem 0;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }
`;

const InvitationText = styled(motion.h1)`
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #9a9ac8, #6a6a9a, #4a4a7a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  text-shadow: 0 0 15px rgba(176, 196, 222, 0.3);
  font-family: 'Playfair Display', serif;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #6a6a9a, #4a4a7a, #6a6a9a);
    border-radius: 3px;
  }
`;

const NameText = styled(motion.h2)`
  font-size: clamp(2.2rem, 5.5vw, 3.5rem);
  margin: 2rem 0;
  color: #e6e6fa;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 1rem 2rem;
  display: inline-block;
  border: 2px solid #6a6a9a;
  border-radius: 50px;
  background: rgba(40, 40, 80, 0.7);
  box-shadow: 0 0 20px rgba(70, 130, 180, 0.3);
  animation: ${float} 3s ease-in-out infinite;
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
    animation: ${pulse} 6s infinite linear;
  }
`;

const DetailsText = styled(motion.p)`
  font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  margin: 1.5rem 0;
  color: #c9c9e5;
  font-weight: 500;
  background: rgba(40, 40, 80, 0.7);
  padding: 1rem 2rem;
  border-radius: 50px;
  display: inline-block;
  border: 1px solid #6a6a9a;
  box-shadow: 0 0 15px rgba(65, 105, 225, 0.2);
  position: relative;
  
  &::after {
    content: "★";
    position: absolute;
    color: rgba(176, 196, 222, 0.5);
    animation: ${sparkle} 2s infinite ease-in-out;
  }
  
  &:nth-child(odd)::after {
    top: -5px;
    right: -5px;
  }
  
  &:nth-child(even)::after {
    bottom: -5px;
    left: -5px;
  }
`;

const Icon = styled.span`
  margin-right: 0.8rem;
  font-size: 1.5rem;
  display: inline-block;
  color: #9a9ac8;
  text-shadow: 0 0 5px rgba(176, 196, 222, 0.5);
`;

const AcceptButton = styled(motion.button)`
  background: linear-gradient(to right, #6a6a9a, #4a4a7a);
  color: #e6e6fa;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  margin: 2rem 0;
  box-shadow: 0 5px 15px rgba(70, 130, 180, 0.5);
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
    background: linear-gradient(to right, #4a4a7a, #6a6a9a);
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
`;

const CelebrationMessage = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(25, 25, 60, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 2rem;
  text-align: center;

  h2 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: 2rem;
    background: linear-gradient(to right, #9a9ac8, #6a6a9a, #4a4a7a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: 'Playfair Display', serif;
    text-shadow: 0 0 10px rgba(176, 196, 222, 0.3);
  }

  p {
    font-size: clamp(1.5rem, 4vw, 2rem);
    color: #e6e6fa;
    max-width: 600px;
    margin-bottom: 3rem;
    line-height: 1.6;
  }
`;

const CloseButton = styled.button`
  background: linear-gradient(to right, #6a6a9a, #4a4a7a);
  color: #e6e6fa;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(70, 130, 180, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(to right, #4a4a7a, #6a6a9a);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(70, 130, 180, 0.7);
  }
`;

const Sparkle = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${sparkle} 2s infinite ease-in-out;
  pointer-events: none;
`;

// ======================
// Componente principal
// ======================
const App = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap';
    link1.rel = 'stylesheet';
    
    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap';
    link2.rel = 'stylesheet';
    
    document.head.appendChild(link1);
    document.head.appendChild(link2);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (e) => {
      if (Math.random() > 0.9) {
        setSparkles(prev => [
          ...prev.slice(-10),
          {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [ref3, inView3] = useInView({ threshold: 0.1 });

  const handleAccept = () => {
    setShowMessage(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const closeMessage = () => {
    setShowMessage(false);
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
            colors={['#6a6a9a', '#4a4a7a', '#9a9ac8', '#7a7aa8']}
          />
        )}
      </AnimatePresence>

      {sparkles.map(sparkle => (
        <Sparkle 
          key={sparkle.id}
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {showMessage && (
        <CelebrationMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2>¡Gracias por aceptar!</h2>
          <p>Tu presencia hará que mis XV Años sean aún más especiales. Estoy emocionada de compartir este día tan importante contigo.</p>
          <CloseButton onClick={closeMessage}>Cerrar</CloseButton>
        </CelebrationMessage>
      )}

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
              <Icon>📍</Icon> Salón de Eventos "Las Estrellas", Av. Principal #123
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

export default App;