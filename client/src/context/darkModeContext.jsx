import { createContext, useEffect, useState } from "react";

//hold state and behaviour related to dark mode
//to access the values being passed by provider we need to mention the write context created and used.
export const DarkModeContext = createContext();

export const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode" || false))
  );
  const toggle = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};
