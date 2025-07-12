import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';

// ======================
// Nuevas Animaciones
// ======================
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(156, 136, 255, 0.4); }
  50% { text-shadow: 0 0 20px rgba(156, 136, 255, 0.8); }
`;

const roseFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  50% { transform: translateY(-25px) rotate(15deg); opacity: 1; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const borderGlow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(156, 136, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(156, 136, 255, 0.6); }
`;

const starTwinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
`;

// ======================
// Componentes estilizados optimizados para móvil
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
  padding: 0 15px;
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
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  z-index: 2;
`;

const ContentBox = styled(motion.div)`
  background: rgba(15, 15, 40, 0.9);
  border-radius: 25px;
  border: 1px solid rgba(156, 136, 255, 0.4);
  box-shadow: 0 0 30px rgba(65, 105, 225, 0.5);
  backdrop-filter: blur(10px);
  padding: 1.8rem 1.5rem;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${css`animation: ${pulse} 6s infinite ease-in-out, ${borderGlow} 4s infinite ease-in-out;`}
  
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
    z-index: -1;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    max-width: 92%;
    border-radius: 22px;
  }

  @media (max-width: 360px) {
    padding: 1.3rem 1rem;
    max-width: 95%;
    border-radius: 20px;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.9rem, 8vw, 2.5rem);
  color: #e6e6fa;
  font-weight: 600;
  font-family: 'Marcellus SC', serif;
  margin: 0 auto 1.2rem;
  letter-spacing: 1.2px;
  ${css`animation: ${textGlow} 3s infinite ease-in-out;`}
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 0 15px;
  text-align: center;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #9c88ff, transparent);
  }

  @media (max-width: 480px) {
    font-size: clamp(1.7rem, 8vw, 2.3rem);
    margin-bottom: 1rem;
    &::after {
      width: 80px;
      bottom: -8px;
    }
  }
`;

const Subtitle = styled.h2`
  font-size: clamp(1.3rem, 5.5vw, 1.8rem);
  color: #b8a8d8;
  font-weight: 500;
  margin: 1rem auto;
  font-style: italic;
  ${css`animation: ${float} 5s infinite ease-in-out;`}
  max-width: 100%;
  padding: 0 15px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: clamp(1.2rem, 5.5vw, 1.6rem);
    margin: 0.8rem auto;
  }
`;

const Text = styled.p`
  font-size: clamp(1rem, 4vw, 1.15rem);
  color: #e6e6fa;
  line-height: 1.7;
  margin: 1.2rem auto;
  letter-spacing: 0.4px;
  max-width: 92%;
  padding: 0 10px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: clamp(0.95rem, 4.2vw, 1.1rem);
    line-height: 1.6;
    margin: 1rem auto;
    max-width: 95%;
  }
`;

const HighlightText = styled.span`
  font-weight: 600;
  color: #9c88ff;
  text-shadow: 0 0 10px rgba(156, 136, 255, 0.6);
`;

const EventDetail = styled.div`
  margin: 1.8rem auto;
  padding: 1.2rem 1rem;
  border-top: 1px solid rgba(156, 136, 255, 0.3);
  border-bottom: 1px solid rgba(156, 136, 255, 0.3);
  position: relative;
  width: 90%;
  text-align: center;
  ${css`animation: ${pulse} 5s infinite ease-in-out;`}
  
  &::before, &::after {
    content: "✦";
    position: absolute;
    color: #9c88ff;
    font-size: 1.2rem;
    top: -12px;
    ${css`animation: ${starTwinkle} 3s infinite ease-in-out;`}
  }
  
  &::before {
    left: 10px;
  }
  
  &::after {
    right: 10px;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
    margin: 1.5rem auto;
    width: 95%;
    &::before, &::after {
      font-size: 1rem;
      top: -10px;
    }
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, rgba(100, 149, 237, 0.4) 0%, rgba(138, 43, 226, 0.4) 100%);
  color: #e6e6fa;
  border: 1px solid #9c88ff;
  padding: 0.9rem 2rem;
  font-size: clamp(1.05rem, 4.5vw, 1.15rem);
  border-radius: 50px;
  cursor: pointer;
  margin: 1.8rem auto 0;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  letter-spacing: 0.6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  display: block;
  width: auto;
  max-width: 90%;
  text-align: center;
  ${css`animation: ${borderGlow} 4s infinite ease-in-out;`}
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(100, 149, 237, 0.6) 0%, rgba(138, 43, 226, 0.6) 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(100, 149, 237, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.8rem;
    margin-top: 1.5rem;
    font-size: clamp(1rem, 4.5vw, 1.1rem);
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
  margin: 0 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 0 10px #9c88ff' : 'none'};
  ${css`animation: ${props => props.active ? pulse : 'none'} 2s infinite ease-in-out;`}
  
  &:hover {
    transform: scale(1.3);
  }

  @media (max-width: 480px) {
    width: 9px;
    height: 9px;
    margin: 0 6px;
  }
`;

const Rose = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${props => props.color || '%239c88ff'}" d="M50 20c-5 0-10 3-10 8 0 5 5 8 10 8s10-3 10-8c0-5-5-8-10-8zm0 15c-10 0-20 5-20 15 0 10 10 15 20 15s20-5 20-15c0-10-10-15-20-15z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: ${props => props.opacity || '0.7'};
  z-index: 1;
  ${css`animation: ${roseFloat} ${props => props.duration || '8s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  filter: drop-shadow(0 0 8px ${props => props.glow || 'rgba(156, 136, 255, 0.7)'});

  @media (max-width: 480px) {
    width: ${props => props.mobileSize || '25px'};
    height: ${props => props.mobileSize || '25px'};
  }
`;

const SparkleEffect = styled.div`
  position: absolute;
  width: ${props => props.size || '6px'};
  height: ${props => props.size || '6px'};
  background: ${props => props.color || '#ffffff'};
  border-radius: 50%;
  ${css`animation: ${sparkle} ${props => props.duration || '2s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  pointer-events: none;
  filter: blur(0.8px);

  @media (max-width: 480px) {
    width: ${props => props.mobileSize || '4px'};
    height: ${props => props.mobileSize || '4px'};
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '15px'};
  height: ${props => props.size || '15px'};
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${props => props.color || '%23b8a8d8'}" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: ${props => props.opacity || '0.6'};
  z-index: 1;
  ${css`animation: ${starTwinkle} ${props => props.duration || '4s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  filter: drop-shadow(0 0 5px ${props => props.glow || 'rgba(184, 168, 216, 0.7)'});

  @media (max-width: 480px) {
    width: ${props => props.mobileSize || '12px'};
    height: ${props => props.mobileSize || '12px'};
  }
`;

// Componente principal
const InvitationPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [decorations, setDecorations] = useState([]);

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
            <Text>Ceremonia: <HighlightText>12:30 PM</HighlightText></Text>
            <Text>Recepción: <HighlightText>3:00 PM</HighlightText></Text>
            <Text style={{marginTop: '0.8rem'}}>Salón "Jardines del Cielo"</Text>
          </EventDetail>
        </>
      )
    },
    {
      content: (
        <>
          <Title>Un Mensaje Especial</Title>
          <Text style={{ fontStyle: 'italic', margin: '1.5rem 0' }}>
            "La verdadera felicidad se encuentra compartiendo los momentos especiales con quienes más amamos. Por eso hoy quiero que formes parte de este sueño que solo se vive una vez."
          </Text>
          <Subtitle style={{ marginTop: '1.2rem', fontWeight: '600' }}>
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
            Por favor confirma tu asistencia antes del 10 de julio para reservar tu lugar en esta celebración inolvidable.
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

  // Crear elementos decorativos
  useEffect(() => {
    const createDecorations = () => {
      const isMobile = window.innerWidth < 480;
      const newDecorations = [];
      
      // Rosas
      const roseCount = isMobile ? 8 : 12;
      for (let i = 0; i < roseCount; i++) {
        newDecorations.push({
          type: 'rose',
          id: `rose-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: `${Math.random() * 20 + 25}px`,
          mobileSize: `${Math.random() * 15 + 20}px`,
          color: `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`,
          opacity: Math.random() * 0.4 + 0.4,
          delay: `${Math.random() * 5}s`,
          duration: `${Math.random() * 5 + 5}s`,
          glow: `rgba(${Math.floor(Math.random() * 156) + 100}, ${Math.floor(Math.random() * 136) + 120}, 255, 0.7)`
        });
      }
      
      // Estrellas
      const starCount = isMobile ? 6 : 10;
      for (let i = 0; i < starCount; i++) {
        newDecorations.push({
          type: 'star',
          id: `star-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: `${Math.random() * 15 + 15}px`,
          mobileSize: `${Math.random() * 10 + 10}px`,
          color: `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`,
          opacity: Math.random() * 0.3 + 0.3,
          delay: `${Math.random() * 3}s`,
          duration: `${Math.random() * 3 + 2}s`
        });
      }
      
      // Destellos
      const sparkleCount = isMobile ? 15 : 25;
      for (let i = 0; i < sparkleCount; i++) {
        newDecorations.push({
          type: 'sparkle',
          id: `sparkle-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: `${Math.random() * 4 + 4}px`,
          mobileSize: `${Math.random() * 3 + 3}px`,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
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
      if (Math.random() > 0.85) {
        setDecorations(prev => [
          ...prev.slice(-50),
          {
            type: 'sparkle',
            id: `mouse-sparkle-${Date.now()}`,
            left: (e.clientX / window.innerWidth) * 100,
            top: (e.clientY / window.innerHeight) * 100,
            size: `${Math.random() * 5 + 5}px`,
            mobileSize: `${Math.random() * 4 + 4}px`,
            color: `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`,
            delay: '0s',
            duration: `${Math.random() * 1 + 0.5}s`
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
      <AnimatePresence mode='wait'>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.15}
            colors={['#9c88ff', '#8a8aba', '#b8a8d8', '#d8c8f8', '#ffffff']}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
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