import React, { FC, createRef, RefObject } from 'react';
import './OpponentsRatingRangeSelector.css';
import Background from './Background';
import ResizableDataProvider from './ResizableDataProvider';
import DynamicRangeDataProvider from './DynamicRangeDataProvider';
import RangeDataSelector from './RangeDataSelector';
import RangeDataTitles from './RangeDataTitles';
import ValuePoint from './ValuePoint';
import { IRangeData } from './interfaces';

export interface OpponentsRatingRangeSelectorProps {
  value: number;
  min: number;
  max: number;
  onChange: (data: IRangeData) => void;
}

export const OpponentsRatingRangeSelector: FC<OpponentsRatingRangeSelectorProps> = (props) => {
  const { max, min, value, onChange } = props;
  let containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  return (
    <div className="opponents-rating-selector" ref={containerRef}>
      <Background/>

      <ResizableDataProvider containerRef={containerRef} max={max} min={min}>
        <DynamicRangeDataProvider value={value} max={max} min={min}>
          <RangeDataSelector max={max} min={min} onChange={onChange}/>

          <RangeDataTitles/>
        </DynamicRangeDataProvider>

        <ValuePoint value={value}/>
      </ResizableDataProvider>

      <div className='opponents-rating-selector__title'>Opponent's preferred rating</div>
    </div>
  );
};
