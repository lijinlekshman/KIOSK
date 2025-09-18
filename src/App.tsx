import React from 'react';
import './App.scss';
import MainRouter from '@routes/mainRouter';
import ThemeSelector from '@shared/components/themes/themeSelector';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <ThemeSelector>
      <MainRouter />
    </ThemeSelector>
  );
}

export default App;
