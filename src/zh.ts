import { ChartType } from './chart-map';
import { DATE_KEY } from './date-map';

export const ZH = {
  SelectXField: '请选择作为 X 轴的字段',
  SelectYField: '请选择作为 Y 轴的字段',
  SelectChartType: '请选择图表类型',
  SelectDate: '请选择时间纬度',
  [ChartType.Line]: '折线图',
  [ChartType.Column]: '柱状图',
  [ChartType.Area]: '面积图',
  [DATE_KEY.Day]: '精确到天',
  [DATE_KEY.Hour]: '精确到小时',
  [DATE_KEY.Minute]: '精确到分钟',
  [DATE_KEY.Second]: '精确到秒',
  info: '请选择需要进行展示的 X 轴和 Y 轴对应的字段'
}