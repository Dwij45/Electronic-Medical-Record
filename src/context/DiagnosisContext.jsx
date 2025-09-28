import React, { createContext, useContext, useState } from 'react';

const DiagnosisContext = createContext();

export const DiagnosisProvider = ({ children }) => {
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);

  return (
    <DiagnosisContext.Provider
      value={{
        currentDiagnosis,
        setCurrentDiagnosis,
        diagnosisHistory,
        setDiagnosisHistory,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  );
};

export const useDiagnosis = () => {
  const context = useContext(DiagnosisContext);
  if (!context) {
    throw new Error('useDiagnosis must be used within DiagnosisProvider');
  }
  return context;
};