import React from "react";
import ReactDOM from "react-dom/client"
import { App } from './App.jsx'
import { AuthProvider } from './services/AuthContext.jsx';

// Tipos de case:
// PascalCase => asi deben ser los componentes dentro de react
// camelCase
// snake_case
// kebab-case

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
        {/* (Si usas React Router, iría aquí adentro) */}
        <App />
    </AuthProvider>
  </React.StrictMode>
);