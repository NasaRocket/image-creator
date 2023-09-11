import { ChartType } from './chart-map';
import { DATE_KEY } from './date-map';

export const EN = {
  SelectXField: 'Select a field for the X axis',
  SelectYField: 'Select a field for the Y axis',
  SelectChartType: 'Select a chart type',
  SelectDate: 'Select a time dimension',
  [ChartType.Line]: 'Line chart',
  [ChartType.Column]: 'Bar chart',
  [ChartType.Area]: 'Area chart',
  [DATE_KEY.Day]: 'Accurate to the day',
  [DATE_KEY.Hour]: 'Accurate to the hour',
  [DATE_KEY.Minute]: 'Accurate to the minute',
  [DATE_KEY.Second]: 'Accurate to the second',
  info: 'Please select the fields corresponding to the X-axis and Y-axis for display'
}