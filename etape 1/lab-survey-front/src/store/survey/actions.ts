import { DateTime } from 'luxon';
import { StepCanceled, StepCompleted, SurveyActionKind } from './types';

export const stepCompleted = (step: number): StepCompleted => ({ type: SurveyActionKind.StepCompleted, step, completedAt: DateTime.local() });

export const stepCanceled = (step: number): StepCanceled => ({ type: SurveyActionKind.StepCanceled, step });
