import React, { createContext, FC, ReactNode, RefObject, useEffect, useState } from 'react';

interface ResizableDataProviderProps {
  children: ReactNode
  containerRef: RefObject<HTMLDivElement>;
  max: number;
  min: number;
}

export interface IResizableDataContext {
  unitSizePx: number;
}

export const ResizableDataContext = createContext<IResizableDataContext>({ unitSizePx: 0 });

const ResizableDataProvider: FC<ResizableDataProviderProps> = ({ children, containerRef, max, min }) => {
  const [unitSizePx, setUnitSizePx] = useState(0);

  useEffect(() => {
    const onResize = (): void => {
      updateUnitSize();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, []);

  useEffect(() => {
    updateUnitSize();
  }, [containerRef, max, min]);

  function updateUnitSize(): void {
    const unitSizePx: number = calculateUnitSize();

    setUnitSizePx(unitSizePx);
  }

  function calculateUnitSize(): number {
    const containerWidthPx: number = containerRef.current?.offsetWidth || 0;
    return containerWidthPx / (max - min);
  }

  return (
    <ResizableDataContext.Provider value={{ unitSizePx }}>
      {children}
    </ResizableDataContext.Provider>
  );
};

export default ResizableDataProvider;