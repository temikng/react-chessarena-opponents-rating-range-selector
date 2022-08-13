import { VALUE_IN_ONE_STEP, MIN_GAP_IN_RANGE } from "../constants";
import { IRangeData } from "../interfaces";

export enum SelectionTargetIdEnum {
  center = 'center',
  left = 'left',
  right = 'right',
}

export interface ISelectionTargetHelper {
  getCursorClassName(): string;
  getMinGapInRange(rangeData: IRangeData): number;
  calculateNewRangeData(params: any): IRangeData;
}

export function createSelectionTargetHelperById(targetId: SelectionTargetIdEnum): ISelectionTargetHelper {
  switch (targetId) {
    case SelectionTargetIdEnum.left:
      return new LeftSideSelectionTargetHelper();
    case SelectionTargetIdEnum.right:
      return new RightSideSelectionTargetHelper();
    case SelectionTargetIdEnum.center:
      return new CenterSelectionTargetHelper();
    default:
      throw new Error(`unknown target id: ${targetId}`);
  }
}

class CenterSelectionTargetHelper implements ISelectionTargetHelper {
  public getCursorClassName(): string { return 'cursor-move-horizontal'; }

  public calculateNewRangeData({ delta, minGapInRange, numberOfSteps, rangeBounds, tmpRangeData }: any): IRangeData {
    let from: number = tmpRangeData.from - numberOfSteps * VALUE_IN_ONE_STEP;
    let to: number = tmpRangeData.to - numberOfSteps * VALUE_IN_ONE_STEP;

    if (delta > 0) {
      from = Math.max(Math.max(from, rangeBounds.min), to - minGapInRange);
      to = Math.max(Math.min(to, rangeBounds.max), from + minGapInRange);
    } else {
      to = Math.min(Math.min(to, rangeBounds.max), from + minGapInRange);
      from = Math.min(Math.max(from, rangeBounds.min), to - minGapInRange);
    }

    return { from, to };
  }

  public getMinGapInRange(rangeData: IRangeData): number {
    return rangeData.to - rangeData.from;
  }
}

abstract class AbstractSidesSelectionTargetHelper implements ISelectionTargetHelper {
  public getCursorClassName(): string { return 'cursor-resize-horizontal'; }

  public getMinGapInRange(): number {
    return MIN_GAP_IN_RANGE;
  }

  public abstract calculateNewRangeData(params: any): IRangeData;
}

class LeftSideSelectionTargetHelper extends AbstractSidesSelectionTargetHelper {
  public calculateNewRangeData({ minGapInRange, numberOfSteps, rangeBounds, tmpRangeData }: any): IRangeData {
    const to = tmpRangeData.to;
    let from = tmpRangeData.from - numberOfSteps * VALUE_IN_ONE_STEP;

    from = Math.min(Math.max(from, rangeBounds.min), to - minGapInRange);

    return { from, to };
  }
}

class RightSideSelectionTargetHelper extends AbstractSidesSelectionTargetHelper {
  public calculateNewRangeData({ minGapInRange, numberOfSteps, rangeBounds, tmpRangeData }: any): IRangeData {
    const from = tmpRangeData.from;
    let to = tmpRangeData.to - numberOfSteps * VALUE_IN_ONE_STEP;

    to = Math.max(Math.min(to, rangeBounds.max), from + minGapInRange);

    return { from, to };
  }
}
