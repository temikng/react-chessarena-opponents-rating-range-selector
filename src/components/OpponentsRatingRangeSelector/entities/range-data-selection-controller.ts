import { ISelectionTargetHelper, SelectionTargetIdEnum, createSelectionTargetHelperById } from './selection-target-helpers';
import { VALUE_IN_ONE_STEP } from '../constants';
import { IRangeData } from '../interfaces';

export class RangeDataSelectionController {
  private rangeBounds = {
    max: 0,
    min: 0,
  };
  private posDownX = 0;
  private oneStepInPX = 0;
  private dynamicRangeData: IRangeData = { from: 0, to: 0 };

  private activated: boolean = false;
  private moved: boolean = false;

  private tmpRangeData!: IRangeData;
  private selectionTargetHelper!: ISelectionTargetHelper;

  public hasActivated(): boolean {
    return this.activated;
  }

  public hasMoved(): boolean {
    return this.moved;
  }

  public getCursorClassName(): string {
    return this.selectionTargetHelper.getCursorClassName();
  }

  public updateUnitSizePx(value: number): void {
    this.oneStepInPX = value * VALUE_IN_ONE_STEP;
  }

  public setRangeBounds(max: number, min: number): void {
    this.rangeBounds.max = max;
    this.rangeBounds.min = min;
  }

  public setDynamicRangeData(data: IRangeData): void {
    this.dynamicRangeData = data;
  }

  public handleDown(posX: number, targetId: string): void {
    this.selectionTargetHelper = createSelectionTargetHelperById(targetId as SelectionTargetIdEnum);
    this.posDownX = posX;

    this.tmpRangeData = {
      from: this.dynamicRangeData.from,
      to: this.dynamicRangeData.to,
    };

    this.activated = true;
    this.moved = false;
  }

  public handleMoveAndGetNewRangeData(posX: number): IRangeData | null {
    if (!this.activated) {
      return null;
    }

    const delta: number = this.posDownX - posX;

    if (delta === 0) {
      return null;
    }

    const numberOfSteps: number = Math.floor(delta / this.oneStepInPX);
    this.moved = numberOfSteps !== 0;

    if (!this.moved) {
      return null;
    }

    return this.selectionTargetHelper.calculateNewRangeData({
      delta,
      numberOfSteps,
      rangeBounds: this.rangeBounds,
      tmpRangeData: this.tmpRangeData,
      minGapInRange: this.selectionTargetHelper.getMinGapInRange(this.tmpRangeData),
    });
  }

  public handleUp(): void {
    this.activated = false;
  }
}
