import React, { FC, useContext, useMemo } from 'react';
import { IResizableDataContext, ResizableDataContext } from './ResizableDataProvider';

interface ValuePointProps {
  value: number;
}

const ValuePoint: FC<ValuePointProps> = ({ value }: ValuePointProps) => {
  const { unitSizePx }: IResizableDataContext = useContext(ResizableDataContext);
  const valuePosPx: number = useMemo(calculateValuePos, [value, unitSizePx]);

  function calculateValuePos(): number {
    return value * unitSizePx;
  }

  return (
    <div
      className="opponents-rating-selector__value"
      style={{
        left: `calc(${valuePosPx}px - 2.5px)`
      }}
    ></div>
  );
};

export default ValuePoint;