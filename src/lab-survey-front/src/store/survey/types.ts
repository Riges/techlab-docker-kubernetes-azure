import { Map } from 'immutable';
import { DateTime } from 'luxon';
import { Action } from 'redux';

export enum SurveyActionKind {
  StepCompleted = 'STEP_COMPLETED',
  StepCanceled = 'STEP_CANCELED'
}

export interface StepCompleted extends Action {
  readonly type: SurveyActionKind.StepCompleted;
  readonly step: number;
  readonly completedAt: DateTime;
}

export interface StepCanceled extends Action {
  readonly type: SurveyActionKind.StepCanceled;
  readonly step: number;
}

export type SurveyAction = StepCompleted | StepCanceled;

export interface SurveyState {
  readonly id: string;
  readonly completedSteps: Map<number, DateTime>;
}
