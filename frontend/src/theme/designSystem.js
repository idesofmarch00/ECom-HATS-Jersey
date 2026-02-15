import styled, { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  mode: 'light',
  background: '#F9FAFB', // Cool gray-50
  surface: '#FFFFFF',    // White
  surfaceMuted: '#F3F4F6', // Gray-100
  primary: '#4F46E5',    // Indigo-600
  primaryHover: '#4338CA', // Indigo-700
  text: '#111827',       // Gray-900
  textMuted: '#4B5563',  // Gray-600
  border: '#E5E7EB',     // Gray-200
  cardBg: '#FFFFFF',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  glow: 'rgba(79, 70, 229, 0.15)',
};

export const darkTheme = {
  mode: 'dark',
  background: '#0F172A', // Slate-900
  surface: '#1E293B',    // Slate-800
  surfaceMuted: '#334155', // Slate-700
  primary: '#6366F1',    // Indigo-500
  primaryHover: '#4F46E5', // Indigo-600
  text: '#F9FAFB',       // Gray-50
  textMuted: '#9CA3AF',  // Gray-400
  border: '#334155',     // Slate-700
  cardBg: '#1E293B',
  shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  glow: 'rgba(99, 102, 241, 0.25)',
};

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* Custom Premium Themed Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 9999px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.textMuted};
  }

  /* Focus rings & inputs overrides */
  input, textarea, select {
    background-color: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.border};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
`;

// Standard Design Tokens as Reusable Styled Components
export const StyledContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const StyledCard = styled.div`
  background-color: ${props => props.theme.cardBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: ${props => props.theme.primary};
  }
`;

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.primary};
  color: #FFFFFF;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px ${props => props.theme.glow};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px ${props => props.theme.glow};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: ${props => props.theme.surfaceMuted};
    color: ${props => props.theme.textMuted};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.glow};
  }
`;

export const StyledHeading = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

export const StyledText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textMuted};
  line-height: 1.25rem;
`;
