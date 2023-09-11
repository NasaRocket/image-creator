import { Line, Column, Area } from '@antv/g2plot';

export enum ChartType  {
  Line = 'line',
  Column = 'column',
  Area = 'area',
}

export const ChartMap = {
  [ChartType.Line]: Line,
  [ChartType.Column]: Column,
  [ChartType.Area]: Area,
}
