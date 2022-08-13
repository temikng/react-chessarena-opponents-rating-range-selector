import React, { Context, createContext, FC, ReactNode, useCallback, useMemo, useReducer } from 'react';
import { INITIAL_MAX_GAP_AROUND_VALUE } from './constants';
import { dynamicRangeDataReducer, getDynamicRangeDataDispatcher } from './dynamic-range-data.store';
import { IRangeData } from './interfaces';

interface IDynamicRangeDataProviderProps {
  children: ReactNode;
  max: number;
  min: number;
  value: number;
}

export interface IDynamicRangeDataContext {
  dynamicRangeData: IRangeData;
  setDynamicRangeData: (data: IRangeData) => void;
}

export const DynamicRangeDataContext: Context<IDynamicRangeDataContext | null>
  = createContext<IDynamicRangeDataContext | null>(null);

const DynamicRangeDataProvider: FC<IDynamicRangeDataProviderProps> = ({ children, value, max, min }) => {
  const initialState: IRangeData = useMemo(calculateRangeData, [value, max, min]);
  const [state, dispatch] = useReducer(dynamicRangeDataReducer, initialState);
  const setDynamicRangeData = useCallback(
    getDynamicRangeDataDispatcher(dispatch),
    [],
  );

  function calculateRangeData(): IRangeData {
    const from: number = Math.max(value - INITIAL_MAX_GAP_AROUND_VALUE, min);
    const to: number = Math.min(value + INITIAL_MAX_GAP_AROUND_VALUE, max);

    return { from, to };
  }

  return (
    <DynamicRangeDataContext.Provider value={{
      dynamicRangeData: state,
      setDynamicRangeData,
    }}>
      {children}
    </DynamicRangeDataContext.Provider>
  );
};

export default DynamicRangeDataProvider;