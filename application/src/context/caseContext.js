import { createContext, useState } from "react";

export const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [caseData, setCaseData] = useState({});

  return (
    <CaseContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </CaseContext.Provider>
  );
};
