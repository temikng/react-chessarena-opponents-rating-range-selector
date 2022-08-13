import React, { FC, useContext } from 'react';
import { DynamicRangeDataContext, IDynamicRangeDataContext } from './DynamicRangeDataProvider';

const RangeDataTitles: FC<{}> = () => {
  const { dynamicRangeData: { from , to } } = useContext(DynamicRangeDataContext) as IDynamicRangeDataContext;

  return (
    <div className='opponents-rating-selector__values-output'>{from}...{to}</div>
  );
};

export default RangeDataTitles;