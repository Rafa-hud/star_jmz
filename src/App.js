import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';

// Animaciones optimizadas
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 6px rgba(156, 136, 255, 0.5); }
  50% { text-shadow: 0 0 15px rgba(156, 136, 255, 0.9); }
`;

const roseFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const borderGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(156, 136, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(156, 136, 255, 0.7); }
`;

const starTwinkle = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 0.9; transform: scale(1.1); }
`;

// Componentes estilizados con medidas exactas
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
  padding: 0 16px;
  box-sizing: border-box;
`;

const SlideContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 16px;
  box-sizing: border-box;
  z-index: 2;
`;

const ContentBox = styled(motion.div)`
  background: rgba(15, 15, 40, 0.92);
  border-radius: 24px;
  border: 1px solid rgba(156, 136, 255, 0.35);
  box-shadow: 0 0 25px rgba(65, 105, 225, 0.45);
  backdrop-filter: blur(12px);
  padding: 24px 20px;
  width: calc(100% - 32px);
  max-width: 440px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${css`animation: ${pulse} 8s infinite ease-in-out, ${borderGlow} 5s infinite ease-in-out;`}
  
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, transparent 65%);
    z-index: -1;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    width: calc(100% - 24px);
    border-radius: 20px;
  }

  @media (max-width: 360px) {
    padding: 18px 14px;
    width: calc(100% - 20px);
    border-radius: 18px;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #e6e6fa;
  font-weight: 600;
  font-family: 'Marcellus SC', serif;
  margin: 0 auto 16px;
  letter-spacing: 1px;
  ${css`animation: ${textGlow} 4s infinite ease-in-out;`}
  position: relative;
  text-align: center;
  width: 100%;
  padding: 0 12px;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #9c88ff, transparent);
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 14px;
    &::after {
      width: 70px;
      bottom: -6px;
    }
  }

  @media (max-width: 360px) {
    font-size: 1.6rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.4rem;
  color: #b8a8d8;
  font-weight: 500;
  margin: 12px auto;
  font-style: italic;
  ${css`animation: ${float} 6s infinite ease-in-out;`}
  text-align: center;
  width: 100%;
  padding: 0 12px;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin: 10px auto;
  }
`;

const Text = styled.p`
  font-size: 1.05rem;
  color: #e6e6fa;
  line-height: 1.6;
  margin: 16px auto;
  letter-spacing: 0.3px;
  text-align: center;
  width: 90%;
  padding: 0 8px;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin: 14px auto;
    width: 95%;
    line-height: 1.5;
  }
`;

const HighlightText = styled.span`
  font-weight: 600;
  color: #9c88ff;
  text-shadow: 0 0 8px rgba(156, 136, 255, 0.6);
`;

const EventDetail = styled.div`
  margin: 20px auto;
  padding: 16px 12px;
  border-top: 1px solid rgba(156, 136, 255, 0.3);
  border-bottom: 1px solid rgba(156, 136, 255, 0.3);
  position: relative;
  width: 90%;
  text-align: center;
  ${css`animation: ${pulse} 6s infinite ease-in-out;`}
  
  &::before, &::after {
    content: "✦";
    position: absolute;
    color: #9c88ff;
    font-size: 16px;
    top: -10px;
    ${css`animation: ${starTwinkle} 4s infinite ease-in-out;`}
  }
  
  &::before {
    left: 12px;
  }
  
  &::after {
    right: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px 10px;
    margin: 18px auto;
    width: 95%;
    &::before, &::after {
      font-size: 14px;
      top: -8px;
    }
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, rgba(100, 149, 237, 0.35) 0%, rgba(138, 43, 226, 0.35) 100%);
  color: #e6e6fa;
  border: 1px solid #9c88ff;
  padding: 12px 28px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  margin: 20px auto 0;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  ${css`animation: ${borderGlow} 5s infinite ease-in-out;`}
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(100, 149, 237, 0.55) 0%, rgba(138, 43, 226, 0.55) 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(100, 149, 237, 0.4);
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    padding: 10px 24px;
    font-size: 1rem;
    margin-top: 18px;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 24px;
  width: 100%;
  z-index: 3;
  padding: 0 16px;
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
  margin: 0 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 0 8px #9c88ff' : 'none'};
  ${css`animation: ${props => props.active ? pulse : 'none'} 2s infinite ease-in-out;`}
  
  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
    margin: 0 6px;
  }
`;

const Rose = styled.div`
  position: absolute;
  width: ${props => props.size || '28px'};
  height: ${props => props.size || '28px'};
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${props => props.color || '%239c88ff'}" d="M50 20c-5 0-10 3-10 8 0 5 5 8 10 8s10-3 10-8c0-5-5-8-10-8zm0 15c-10 0-20 5-20 15 0 10 10 15 20 15s20-5 20-15c0-10-10-15-20-15z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: ${props => props.opacity || '0.7'};
  z-index: 1;
  ${css`animation: ${roseFloat} ${props => props.duration || '8s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  filter: drop-shadow(0 0 6px ${props => props.glow || 'rgba(156, 136, 255, 0.7)'});

  @media (max-width: 480px) {
    width: ${props => props.mobileSize || '22px'};
    height: ${props => props.mobileSize || '22px'};
  }
`;

const SparkleEffect = styled.div`
  position: absolute;
  width: ${props => props.size || '5px'};
  height: ${props => props.size || '5px'};
  background: ${props => props.color || '#ffffff'};
  border-radius: 50%;
  ${css`animation: ${sparkle} ${props => props.duration || '2s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  pointer-events: none;
  filter: blur(0.6px);

  @media (max-width: 480px) {
    width: ${props => props.mobileSize || '4px'};
    height: ${props => props.mobileSize || '4px'};
  }
`;

const LocationLink = styled.a`
  color: #9c88ff;
  text-decoration: none;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(156, 136, 255, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 12px rgba(156, 136, 255, 0.8);
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '14px'};
  height: ${props => props.size || '14px'};
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${props => props.color || '%23b8a8d8'}" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: ${props => props.opacity || '0.6'};
  z-index: 1;
  ${css`animation: ${starTwinkle} ${props => props.duration || '4s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  filter: drop-shadow(0 0 4px ${props => props.glow || 'rgba(184, 168, 216, 0.7)'});

  @media (max-width: 480px) {
    width: ${props => props.mobileSize || '12px'};
    height: ${props => props.mobileSize || '12px'};
  }
`;

const ThankYouMessage = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(15, 15, 40, 0.95);
  padding: 20px 30px;
  border-radius: 15px;
  border: 1px solid #9c88ff;
  box-shadow: 0 0 20px rgba(156, 136, 255, 0.6);
  z-index: 100;
  text-align: center;
`;

// Componente principal
const InvitationPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [decorations, setDecorations] = useState([]);

  // Función para manejar la confirmación
  const handleConfirmation = () => {
    setShowConfetti(true);
    setShowThankYou(true);
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  // Slides con contenido mejorado
  const slides = [
    {
      content: (
        <>
          <Title>¡Te Invitamos a Mis XV Años!</Title>
          <Subtitle>Estrella Jiménez Martínez</Subtitle>
          <Text>
            Mis padres <HighlightText>Reyes Rafael y Patricia Martínez Cedillo</HighlightText> y yo tenemos el honor de invitarte a celebrar este momento tan especial en mi vida.
          </Text>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Padrinos de Honor</Title>
          <Subtitle>Abel y Guadalupe Martínez Cedillo</Subtitle>
          <Text>
            Con profundo agradecimiento por su amor y apoyo incondicional en este día tan significativo de mi transición a la vida adulta.
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
            <Text>Hora: <HighlightText>3:00 PM</HighlightText></Text>
            <Text>
              Ubicación:{' '}
              <LocationLink 
                href="https://www.google.com/maps/place/Pueblo+Nuevo+Tlamimilolpan" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Pueblo Nuevo Tlamimilolpan
              </LocationLink>
            </Text>
            <Text style={{marginTop: '12px', fontStyle: 'italic'}}>
              "Los espero en mi casa 🎉🥳"
            </Text>
          </EventDetail>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Un Mensaje Especial</Title>
          <Text style={{ fontStyle: 'italic', margin: '20px 0' }}>
            "La verdadera felicidad se encuentra compartiendo los momentos especiales con quienes más amamos. Por eso hoy quiero que formes parte de este sueño que solo se vive una vez."
          </Text>
          <Subtitle style={{ marginTop: '16px', fontWeight: '600' }}>
            - Con todo mi cariño, Estrella
          </Subtitle>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Confirma Tu Asistencia</Title>
          <Text>
            Por favor confirma tu asistencia 🥳🎉
          </Text>
          <Button 
            onClick={handleConfirmation}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Confirmar Asistencia
          </Button>
        </>
      )
    }
  ];

  // Crear elementos decorativos
  useEffect(() => {
    const createDecorations = () => {
      const isMobile = window.innerWidth < 480;
      const newDecorations = [];
      
      // Rosas
      const roseCount = isMobile ? 6 : 10;
      for (let i = 0; i < roseCount; i++) {
        newDecorations.push({
          type: 'rose',
          id: `rose-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: '28px',
          mobileSize: '22px',
          color: '#9c88ff',
          opacity: Math.random() * 0.3 + 0.4,
          delay: `${Math.random() * 5}s`,
          duration: `${Math.random() * 4 + 6}s`,
          glow: 'rgba(156, 136, 255, 0.7)'
        });
      }
      
      // Estrellas
      const starCount = isMobile ? 5 : 8;
      for (let i = 0; i < starCount; i++) {
        newDecorations.push({
          type: 'star',
          id: `star-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: '14px',
          mobileSize: '12px',
          color: '#b8a8d8',
          opacity: Math.random() * 0.3 + 0.4,
          delay: `${Math.random() * 3}s`,
          duration: `${Math.random() * 3 + 3}s`,
          glow: 'rgba(184, 168, 216, 0.7)'
        });
      }
      
      // Destellos estáticos
      const sparkleCount = isMobile ? 12 : 20;
      for (let i = 0; i < sparkleCount; i++) {
        newDecorations.push({
          type: 'sparkle',
          id: `sparkle-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: '5px',
          mobileSize: '4px',
          color: 'rgba(255, 255, 255, 0.8)',
          delay: `${Math.random() * 2}s`,
          duration: `${Math.random() * 2 + 1}s`
        });
      }
      
      setDecorations(newDecorations);
    };

    createDecorations();
    window.addEventListener('resize', createDecorations);
    return () => window.removeEventListener('resize', createDecorations);
  }, []);

  // Efectos de destello con movimiento del mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.9) {
        setDecorations(prev => [
          ...prev.slice(-30),
          {
            type: 'sparkle',
            id: `mouse-sparkle-${Date.now()}`,
            left: (e.clientX / window.innerWidth) * 100,
            top: (e.clientY / window.innerHeight) * 100,
            size: '6px',
            mobileSize: '5px',
            color: 'rgba(255, 255, 255, 0.9)',
            delay: '0s',
            duration: '0.8s'
          }
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cambio automático de slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Actualizar tamaño de ventana
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
      {/* Mensaje de agradecimiento */}
      <AnimatePresence>
        {showThankYou && (
          <ThankYouMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Text style={{ fontSize: '1.2rem', color: '#e6e6fa', margin: 0 }}>
              ¡Gracias por aceptar! Te espero en mi fiesta 🥳🎉
            </Text>
          </ThankYouMessage>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={250}
            gravity={0.2}
            colors={['#9c88ff', '#8a8aba', '#b8a8d8', '#d8c8f8']}
            onConfettiComplete={() => setShowConfetti(false)}
            style={{ zIndex: 10 }}
          />
        )}
      </AnimatePresence>

      {/* Elementos decorativos */}
      {decorations.map(item => {
        const style = {
          left: `${item.left}%`,
          top: `${item.top}%`,
        };
        
        switch(item.type) {
          case 'rose':
            return (
              <Rose
                key={item.id}
                style={style}
                size={item.size}
                mobileSize={item.mobileSize}
                color={item.color}
                opacity={item.opacity}
                delay={item.delay}
                duration={item.duration}
                glow={item.glow}
              />
            );
          case 'star':
            return (
              <Star
                key={item.id}
                style={style}
                size={item.size}
                mobileSize={item.mobileSize}
                color={item.color}
                opacity={item.opacity}
                delay={item.delay}
                duration={item.duration}
                glow={item.glow}
              />
            );
          case 'sparkle':
            return (
              <SparkleEffect
                key={item.id}
                style={style}
                size={item.size}
                mobileSize={item.mobileSize}
                color={item.color}
                delay={item.delay}
                duration={item.duration}
              />
            );
          default:
            return null;
        }
      })}

      <SlideContainer>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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