import useTheme from '../hooks/useTheme';
import { ThemeContext } from './ThemeContextValue';

export function ThemeProvider({ children }) {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}
