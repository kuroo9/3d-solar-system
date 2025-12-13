import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  }
`;

const DetailsOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.92);
  padding: 2.2rem;
  border-radius: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  max-width: 560px;
  width: 90%;
  z-index: 1000;
  backdrop-filter: blur(18px);
  animation: ${slideIn} 0.28s ease-out;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
  font-family: "BBH bartle", sans-serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.1rem;
  cursor: pointer;
  color: #e5e7eb;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: rotate(90deg);
  }
`;

const ProjectTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const StatusBadge = styled.span`
  background: transparent;
  color: #ffffff;
  padding: 0.28rem 0.8rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  animation: ${pulse} 2.2s infinite;
`;

const PlanetType = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.32rem 0.8rem;
  border-radius: 0;
  font-size: 0.78rem;
  text-transform: capitalize;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Description = styled.p`
  color: #e5e5e5;
  line-height: 1.6;
  margin: 1.2rem 0;
  font-size: 1.05rem;
`;

const DefinitionSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 1.1rem;
  border-radius: 12px;
  margin: 1.2rem 0;
  border-left: 2px solid rgba(255, 255, 255, 0.18);
  animation: ${glow} 3s ease-in-out infinite;
  
  strong {
    color: #ffffff;
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
  
  p {
    color: #e5e5e5;
    margin: 0;
    font-style: italic;
    line-height: 1.5;
    font-size: 0.95rem;
  }
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.5rem 0;
`;

const TechTag = styled.span`
  background: linear-gradient(45deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12));
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.45rem 0.9rem;
  border-radius: 0;
  font-size: 0.88rem;
  color: #ffffff;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255,255,255,0.12);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.a`
  padding: 0.9rem 1.4rem;
  border-radius: 0;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: 2px solid #ffffff;
  color: #ffffff;
  background: transparent;
  
  ${props => props.primary ? `
    background: #ffffff;
    color: #000000;
    
    &:hover {
      background: transparent;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(255,255,255,0.15);
    }
  ` : `
    &:hover {
      background: #ffffff;
      color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(255,255,255,0.15);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const ProjectMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const MetaItem = styled.div`
  background: rgba(255, 255, 255, 0.04);
  padding: 0.9rem;
  border-radius: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  strong {
    color: #ffffff;
    display: block;
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
  }
  
  span {
    color: #e5e5e5;
    font-size: 0.95rem;
  }
`;

const PlanetFeatures = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const FeatureBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.45rem 0.9rem;
  border-radius: 0;
  font-size: 0.78rem;
  color: #e5e5e5;
`;

const ProjectDetails = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <DetailsOverlay>
      <CloseButton onClick={onClose}>×</CloseButton>
      
      <ProjectTitle>
        {project.title}
        <StatusBadge status={project.status}>{project.status}</StatusBadge>
        <PlanetType color={project.color}>{project.planetType}</PlanetType>
      </ProjectTitle>
      
      <ProjectMeta>
        <MetaItem>
          <strong>Category</strong>
          <span>{project.category}</span>
        </MetaItem>
        <MetaItem>
          <strong>Orbital Position</strong>
          <span>{
            project.id === 1 ? 'Mercury (1st)' :
            project.id === 2 ? 'Venus (2nd)' :
            project.id === 3 ? 'Earth (3rd)' :
            project.id === 4 ? 'Mars (4th)' :
            project.id === 5 ? 'Jupiter (5th)' :
            project.id === 6 ? 'Saturn (6th)' :
            project.id === 7 ? 'Uranus (7th)' :
            project.id === 8 ? 'Neptune (8th)' :
            'Pluto (9th)'
          }</span>
        </MetaItem>
      </ProjectMeta>
      
      <Description>{project.description}</Description>
      
      <DefinitionSection>
        <strong>Celestial Definition:</strong>
        <p>{project.definition}</p>
      </DefinitionSection>
      
      <PlanetFeatures>
        {project.rings && (
          <FeatureBadge icon="💫">Ring System</FeatureBadge>
        )}
        {project.atmosphere && (
          <FeatureBadge icon="🌫️">Atmosphere</FeatureBadge>
        )}
        <FeatureBadge icon="📊">
          {project.planetType?.charAt(0).toUpperCase() + project.planetType?.slice(1)} Type
        </FeatureBadge>
      </PlanetFeatures>
      
      <div>
        <strong style={{ color: 'white', display: 'block', marginBottom: '1rem' }}>
          Technologies Used:
        </strong>
        <TechList>
          {project.technologies.map((tech, index) => (
            <TechTag key={index}>
              {tech}
            </TechTag>
          ))}
        </TechList>
      </div>
      
      <ButtonGroup>
        {project.githubUrl && (
          <Button 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Source Code
          </Button>
        )}
        {project.liveUrl ? (
          <Button 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            primary
          >
            Live Demo
          </Button>
        ) : (
          <Button 
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Coming Soon
          </Button>
        )}
      </ButtonGroup>
    </DetailsOverlay>
  );
};

export default ProjectDetails;