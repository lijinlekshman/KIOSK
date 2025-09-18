import {
  Suspense,
  lazy,
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect
} from 'react';

// Create a simple theme context for your approach
const ThemeContext = createContext<{
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}>({
  currentTheme: 'DefaultTheme',
  setCurrentTheme: () => {
    // Empty function for default context
  }
});

// Lazy load theme components
const DefaultThemeComponent = lazy(
  () => import('@shared/components/themes/defaultTheme')
);
const Theme1Component = lazy(() => import('@shared/components/themes/theme1'));
const Theme2Component = lazy(() => import('@shared/components/themes/theme2'));

interface IThemeSelectorProps {
  children: ReactNode;
}

const ThemeSelector = ({ children }: IThemeSelectorProps) => {
  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem('Theme') || 'DefaultTheme'
  );
  const [forceUpdate, setForceUpdate] = useState(0);

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('Theme', theme);
    setForceUpdate(prev => prev + 1); // Force immediate re-render
    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme } })
    );
  };

  // Apply theme CSS immediately when theme changes
  useEffect(() => {
    // Remove existing theme classes
    document.documentElement.classList.remove(
      'theme-defaulttheme',
      'theme-theme1',
      'theme-theme2'
    );

    // Add new theme class
    const themeClass = `theme-${currentTheme.toLowerCase()}`;
    document.documentElement.classList.add(themeClass);

    // Force a re-render of all components
    setForceUpdate(prev => prev + 1);
  }, [currentTheme]);

  // Render theme component based on current theme
  const renderThemeComponent = () => {
    switch (currentTheme) {
      case 'DefaultTheme':
        return <DefaultThemeComponent key='default' />;
      case 'Theme1':
        return <Theme1Component key='theme1' />;
      case 'Theme2':
        return <Theme2Component key='theme2' />;
      default:
        return <DefaultThemeComponent key='default' />;
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme: setTheme }}>
      <div
        key={`${currentTheme}-${forceUpdate}`}
        className={`theme-${currentTheme.toLowerCase()}`}
      >
        <Suspense fallback={null}>{renderThemeComponent()}</Suspense>
        <div key={`children-${forceUpdate}`}>{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};

// Hook to use theme in components
export const useThemeSelector = () => useContext(ThemeContext);

export default ThemeSelector;
