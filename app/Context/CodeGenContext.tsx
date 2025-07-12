"use client";

import React, { createContext, useContext, useState } from "react";

type CodeGenContextType = {
  isCodeGenerated: boolean;
  setIsCodeGenerated: (value: boolean) => void;
};

const CodeGenContext = createContext<CodeGenContextType | null>(null);

export const CodeGenProvider = ({children}:{children:React.ReactNode}) =>{
    const [isCodeGenerated,setIsCodeGenerated] = useState(false);

    return(
        <CodeGenContext.Provider value={{ isCodeGenerated, setIsCodeGenerated }}>
            {children}
        </CodeGenContext.Provider>
    );
}

export const useCodeGen = () => {
  const context = useContext(CodeGenContext);
  if (!context) throw new Error("useCodeGen must be used inside CodeGenProvider");
  return context;
};