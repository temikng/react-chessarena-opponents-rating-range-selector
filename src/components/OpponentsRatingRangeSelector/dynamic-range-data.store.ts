import { Dispatch, ReducerAction } from "react";
import { IRangeData } from "./interfaces";

enum DynamicRangeDataActionType {
  SET_DYNAMIC_RANGE_DATA = 'SET_DYNAMIC_RANGE_DATA',
};

interface IDynamicRangeDataAction {
  type: DynamicRangeDataActionType;
  payload: IRangeData;
}

type DynamicRangeDataReducer = (prevState: IRangeData, action: IDynamicRangeDataAction) => IRangeData;

export const dynamicRangeDataReducer: DynamicRangeDataReducer =
  (prevState: IRangeData, { type, payload }: IDynamicRangeDataAction): IRangeData => {
    switch (type) {
      case DynamicRangeDataActionType.SET_DYNAMIC_RANGE_DATA:
        return { ...payload };
      default:
        return prevState;
    }
  };

export const getDynamicRangeDataDispatcher = (dispatch: Dispatch<ReducerAction<DynamicRangeDataReducer>>) =>
  (payload: IRangeData) => dispatch({
    type: DynamicRangeDataActionType.SET_DYNAMIC_RANGE_DATA,
    payload,
  });