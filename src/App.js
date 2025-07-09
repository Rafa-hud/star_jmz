import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';

// ======================
// Animaciones
// ======================
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
  50% { text-shadow: 0 0 15px rgba(100, 149, 237, 0.7); }
  100% { text-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
`;

const roseFloat = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
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
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
  color: #e6e6fa;
  font-family: 'Playfair Display', serif;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
`;

const SlideContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* Cambiado de center a flex-start */
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  z-index: 2;
`;

const ContentBox = styled(motion.div)`
  background: rgba(15, 15, 40, 0.85);
  border-radius: 20px;
  border: 1px solid rgba(100, 149, 237, 0.3);
  box-shadow: 0 0 30px rgba(65, 105, 225, 0.4);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 0 0 20px; /* Cambiado el margen para alinear a la izquierda */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.05) 0%, transparent 70%);
    z-index: -1;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
    max-width: 95%;
    margin: 0 0 0 10px; /* Ajuste para móviles */
  }

  @media (max-width: 360px) {
    padding: 1rem;
    max-width: 98%;
    margin: 0 0 0 5px; /* Ajuste para móviles pequeños */
  }
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 7vw, 2.8rem);
  color: #e6e6fa;
  font-weight: 600;
  font-family: 'Marcellus SC', serif;
  margin: 0 auto 1rem;
  letter-spacing: 1px;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 0 10px;
  text-align: center;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8a8aba, transparent);
  }

  @media (max-width: 480px) {
    font-size: clamp(1.6rem, 7vw, 2.4rem);
    margin-bottom: 0.8rem;
  }
`;

const Subtitle = styled.h2`
  font-size: clamp(1.4rem, 5vw, 2rem);
  color: #b8a8d8;
  font-weight: 500;
  margin: 0.8rem auto;
  font-style: italic;
  ${css`animation: ${float} 4s infinite ease-in-out;`}
  max-width: 100%;
  padding: 0 10px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: clamp(1.3rem, 5vw, 1.8rem);
  }
`;

const Text = styled.p`
  font-size: clamp(1rem, 3.8vw, 1.2rem);
  color: #e6e6fa;
  line-height: 1.7;
  margin: 1rem auto;
  letter-spacing: 0.3px;
  max-width: 90%;
  padding: 0 10px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: clamp(0.95rem, 4vw, 1.1rem);
    line-height: 1.6;
    max-width: 95%;
  }
`;

const HighlightText = styled.span`
  font-weight: 600;
  color: #9c88ff;
  text-shadow: 0 0 8px rgba(156, 136, 255, 0.5);
`;

const EventDetail = styled.div`
  margin: 1.5rem auto;
  padding: 1rem;
  border-top: 1px solid rgba(138, 138, 186, 0.4);
  border-bottom: 1px solid rgba(138, 138, 186, 0.4);
  position: relative;
  max-width: 90%;
  text-align: center;
  
  &::before, &::after {
    content: "✧";
    position: absolute;
    color: #8a8aba;
    font-size: 1rem;
    top: -8px;
  }
  
  &::before {
    left: 5px;
  }
  
  &::after {
    right: 5px;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    margin: 1.2rem auto;
    max-width: 95%;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, rgba(100, 149, 237, 0.3) 0%, rgba(138, 43, 226, 0.3) 100%);
  color: #e6e6fa;
  border: 1px solid #8a8aba;
  padding: 0.8rem 2rem;
  font-size: clamp(1rem, 4vw, 1.1rem);
  border-radius: 50px;
  cursor: pointer;
  margin: 1.5rem auto 0;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  display: block;
  width: auto;
  max-width: 90%;
  text-align: center;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(100, 149, 237, 0.5) 0%, rgba(138, 43, 226, 0.5) 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(100, 149, 237, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    padding: 0.7rem 1.8rem;
    margin-top: 1.2rem;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 25px;
  width: 100%;
  z-index: 3;
  padding: 0 15px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    bottom: 20px;
  }
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? '#9c88ff' : 'rgba(156, 136, 255, 0.3)'};
  margin: 0 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 0 8px #9c88ff' : 'none'};
  
  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
    margin: 0 5px;
  }
`;

const Rose = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%239c88ff" d="M50 20c-5 0-10 3-10 8 0 5 5 8 10 8s10-3 10-8c0-5-5-8-10-8zm0 15c-10 0-20 5-20 15 0 10 10 15 20 15s20-5 20-15c0-10-10-15-20-15z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.7;
  z-index: 1;
  ${css`animation: ${roseFloat} 8s infinite ease-in-out;`}
  filter: drop-shadow(0 0 5px rgba(156, 136, 255, 0.7));

  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
  }
`;

const SparkleEffect = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  ${css`animation: ${sparkle} 2s infinite ease-in-out;`}
  pointer-events: none;
  filter: blur(0.5px);

  @media (max-width: 480px) {
    width: 4px;
    height: 4px;
  }
`;

// Componente de presentación automática
const InvitationPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [roses, setRoses] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  // Slides basados en las imágenes compartidas
  const slides = [
    {
      content: (
        <>
          <Title>¡Te Invitamos a Mis XV Años!</Title>
          <Subtitle>Estrella Jimenez Martinez</Subtitle>
          <Text>
            Mis padres <HighlightText>Reyes Rafael y Patricia Martinez Cedillo</HighlightText> y yo tenemos el honor de invitarte a celebrar este momento tan especial.
          </Text>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Padrinos de Honor</Title>
          <Subtitle>Abel y Guadalupe Martinez Cedillo</Subtitle>
          <Text>
            Agradecemos su amor y apoyo en este día tan importante de mi transición a la vida adulta.
          </Text>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Detalles del Evento</Title>
          <EventDetail>
            <Text><HighlightText>SÁBADO 19 DE JULIO 2025</HighlightText></Text>
            <Text>Misa: <HighlightText>12:30 PM</HighlightText></Text>
            <Text>Comida: <HighlightText>3:00 PM</HighlightText></Text>
          </EventDetail>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Un Mensaje Especial</Title>
          <Text style={{ fontStyle: 'italic', margin: '1.5rem 0' }}>
            "He aprendido que estar con quienes amo es suficiente para ser feliz. Por eso deseo compartir contigo este momento que solo se vive una vez"
          </Text>
          <Subtitle style={{ marginTop: '1rem', fontWeight: '600' }}>
            - Con cariño, Estrella
          </Subtitle>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Confirma Tu Asistencia</Title>
          <Text>
            Por favor confirma tu asistencia para reservar tu lugar en esta celebración.
          </Text>
          <Button 
            onClick={() => setShowConfetti(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Confirmar Asistencia
          </Button>
        </>
      )
    }
  ];

  // Crear rosas flotantes
  useEffect(() => {
    const newRoses = [];
    const roseCount = window.innerWidth < 480 ? 5 : 8;
    for (let i = 0; i < roseCount; i++) {
      newRoses.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 15 + 20,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5
      });
    }
    setRoses(newRoses);
  }, []);

  // Crear efectos de destello
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.9) {
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Cambio automático de slides
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container>
      <AnimatePresence mode='wait'>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            colors={['#9c88ff', '#8a8aba', '#b8a8d8', '#d8c8f8']}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
      </AnimatePresence>

      {/* Rosas flotantes */}
      {roses.map(rose => (
        <Rose
          key={rose.id}
          style={{
            left: `${rose.left}%`,
            top: `${rose.top}%`,
            width: `${rose.size}px`,
            height: `${rose.size}px`,
            animationDuration: `${rose.duration}s`,
            animationDelay: `${rose.delay}s`
          }}
        />
      ))}

      {/* Efectos de destello */}
      {sparkles.map(sparkle => (
        <SparkleEffect
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

      <SlideContainer>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ContentBox>
              {slides[currentSlide].content}
            </ContentBox>
          </motion.div>
        </AnimatePresence>

        <ProgressDots>
          {slides.map((_, index) => (
            <Dot 
              key={index} 
              active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </ProgressDots>
      </SlideContainer>
    </Container>
  );
};

export default InvitationPresentation;