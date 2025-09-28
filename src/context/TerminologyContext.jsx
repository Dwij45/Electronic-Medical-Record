import React, { createContext, useContext, useState } from 'react';

const TerminologyContext = createContext();

export const TerminologyProvider = ({ children }) => {
  const [codeSystems, setCodeSystems] = useState([]);
  const [mappings, setMappings] = useState({});
  const [syncStatus, setSyncStatus] = useState({});

  return (
    <TerminologyContext.Provider
      value={{
        codeSystems,
        setCodeSystems,
        mappings,
        setMappings,
        syncStatus,
        setSyncStatus,
      }}
    >
      {children}
    </TerminologyContext.Provider>
  );
};

export const useTerminology = () => {
  const context = useContext(TerminologyContext);
  if (!context) {
    throw new Error('useTerminology must be used within TerminologyProvider');
  }
  return context;
};