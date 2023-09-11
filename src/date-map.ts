export enum DATE_KEY {
  Day = 'Day',
  Hour = 'Hour',
  Minute = 'Minute',
  Second = 'Second',
}

export const DATE_FORMATTER = {
  [DATE_KEY.Day]: 'YYYY-MM-DD',
  [DATE_KEY.Hour]: 'YYYY-MM-DD HH',
  [DATE_KEY.Minute]: 'YYYY-MM-DD HH:mm',
  [DATE_KEY.Second]: 'YYYY-MM-DD HH:mm:ss',
};