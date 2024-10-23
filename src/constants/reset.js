import React, { createContext, useContext, useState } from 'react';

const ResetContext = createContext();

export const ResetProvider = ({ children }) => {
    const [resetKey, setResetKey] = useState(0);

    const reset = () => {
        setResetKey(prev => prev + 1);
    };

    return (
        <ResetContext.Provider value={{ resetKey, reset }}>
            {children}
        </ResetContext.Provider>
    );
};

export const useReset = () => {
    return useContext(ResetContext);
};
