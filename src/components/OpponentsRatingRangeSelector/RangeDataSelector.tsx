import React, { FC, useContext, useEffect, useState } from 'react';
import { IResizableDataContext, ResizableDataContext } from './ResizableDataProvider';
import { DynamicRangeDataContext, IDynamicRangeDataContext } from './DynamicRangeDataProvider';
import { IRangeData } from './interfaces';
import { RangeDataSelectionController } from './entities/range-data-selection-controller';

export interface RangeDataSelectorProps {
  max: number;
  min: number;
  onChange: (data: IRangeData) => void;
}

let newRangeData: IRangeData | null;
const selectionController = new RangeDataSelectionController();

const RangeDataSelector: FC<RangeDataSelectorProps> = ({ max, min, onChange }) => {
  const { unitSizePx }: IResizableDataContext = useContext(ResizableDataContext);
  const { dynamicRangeData, setDynamicRangeData } = useContext(DynamicRangeDataContext) as IDynamicRangeDataContext;
  const [ rangeDataPx, setRangeDataPx ] = useState(convertRangeDataWithPx(dynamicRangeData, unitSizePx));

  useEffect(() => {
    onChange(dynamicRangeData);
  }, []);

  useEffect(() => {
    selectionController.setRangeBounds(max, min);
  }, [max, min]);

  useEffect(() => {
    selectionController.setDynamicRangeData(dynamicRangeData);
  }, [dynamicRangeData]);

  useEffect(() => {
    selectionController.updateUnitSizePx(unitSizePx);
    updateRangeDataPx(dynamicRangeData);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchend', onUp);
    };
  }, [unitSizePx]);

  function updateRangeDataPx(data: IRangeData): void {
    const convertedData: IRangeData = convertRangeDataWithPx(data, unitSizePx);
    setRangeDataPx(convertedData);
  };

  function onMove(posX: number): void {
    if (!selectionController.hasActivated()) {
      return;
    }

    newRangeData = selectionController.handleMoveAndGetNewRangeData(posX);

    if (newRangeData) {
      updateRangeDataPx(newRangeData);
      setDynamicRangeData(newRangeData);
    }
  }

  function onMouseMove(event: MouseEvent): void {
    const posX: number = event.clientX;
    onMove(posX);
  }

  function onTouchMove(event: TouchEvent): void {
    const posX: number = event.touches[0].clientX;
    onMove(posX);
  }

  function onUp(): void {
    if (!selectionController.hasActivated()) {
      return;
    }

    selectionController.handleUp();
    removeCursorFromBody();

    if (selectionController.hasMoved() && newRangeData) {
      onChange(newRangeData);
    }
  }

  return (
    <>
      <div className='opponents-rating-selector__backdrops'>
        <div
          className='opponents-rating-selector__backdrop opponents-rating-selector__backdrop--left'
          style={{
            right: `calc(100% - ${rangeDataPx.from}px)`
          }}
        ></div>
        <div
          className='opponents-rating-selector__backdrop opponents-rating-selector__backdrop--right'
          style={{
            left: `${rangeDataPx.to}px`
          }}
        ></div>
      </div>
      <div
        className="opponents-rating-selector__selection"
        data-id="center"
        style={{
          width: `${rangeDataPx.to - rangeDataPx.from}px`,
          left: `${rangeDataPx.from}px`,
        }}
        onMouseDown={ onSelectionElementMouseDown }
        onTouchStart={ onSelectionElementTouchDown }
      >
        <div
          className="opponents-rating-selector__selection-handle opponents-rating-selector__selection-handle--left"
          data-id="left"
          onMouseDown={ onSelectionElementMouseDown }
          onTouchStart={ onSelectionElementTouchDown }
        ></div>
        <div
          className="opponents-rating-selector__selection-handle opponents-rating-selector__selection-handle--right"
          data-id="right"
          onMouseDown={ onSelectionElementMouseDown }
          onTouchStart={ onSelectionElementTouchDown }
        ></div>
      </div>
    </>
  );
};

function onSelectionElementDown(event: React.UIEvent<HTMLDivElement>, posX: number): void {
  const targetId: string | undefined = (event.target as HTMLDivElement).dataset.id;
  if (!targetId) {
    return;
  }

  selectionController.handleDown(posX, targetId);

  addCursorToBody();
  event.stopPropagation();
}

function onSelectionElementMouseDown(event: React.MouseEvent<HTMLDivElement>): void {
  const posX: number = event.clientX;
  onSelectionElementDown(event, posX);
}

function onSelectionElementTouchDown(event: React.TouchEvent<HTMLDivElement>): void {
  const posX: number = event.touches[0].clientX;
  onSelectionElementDown(event, posX);
}

function addCursorToBody(): void {
  document.body.classList.add(selectionController.getCursorClassName());
}

function removeCursorFromBody(): void {
  document.body.classList.remove(selectionController.getCursorClassName());
}

function convertRangeDataWithPx(data: IRangeData, unitSizePx: number): IRangeData {
  return {
    from: unitSizePx * data.from,
    to: unitSizePx * data.to,
  };
}

export default RangeDataSelector;
