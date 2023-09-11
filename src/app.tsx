import './app.css';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { bitable, FieldType, IDateTimeField, IFieldMeta, IOpenNumber, ITable } from '@lark-base-open/js-sdk';
import { Alert, Form, Select, Spin } from 'antd';
import { ChartMap, ChartType } from './chart-map';
import { Column, Line, Area } from '@antv/g2plot';
import { DATE_FORMATTER, DATE_KEY } from './date-map';
import { debounce } from 'lodash-es';
import { useTranslation } from 'react-i18next';

const Y_FIELD_TYPE = [FieldType.Number, FieldType.Progress, FieldType.Rating, FieldType.Currency]
const X_FIELD_TYPE = [FieldType.DateTime, FieldType.CreatedTime, FieldType.ModifiedTime]

const X_Field_KEY = 'Date';
const Y_Field_KEY = 'Value';

export const App = () => {
  const chartContainer = useRef<HTMLDivElement>(null)
  const [xItemList, setXItemList] = useState<IFieldMeta[]>([]);
  const [yItemList, setYItemList] = useState<IFieldMeta[]>([]);
  const [xFieldId, setXFieldId] = useState<string>();
  const [yFieldId, setYFieldId] = useState<string>();
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [chartType, setChartType] = useState<ChartType>(ChartType.Column);
  const [chartInstance, setChartInstance] = useState<Line | Column | Area>();
  const [dateType, setDateType] = useState<string>(DATE_FORMATTER[DATE_KEY.Day]);
  const { t } = useTranslation();

  const fetchXYItemList = async () => {
    const table = await bitable.base.getActiveTable();
    let xFieldMetaList: IFieldMeta[] = [];
    for (const fieldType of X_FIELD_TYPE) {
      xFieldMetaList = (await table.getFieldMetaListByType(fieldType)).concat(xFieldMetaList)
    }
    let yFieldMetaList: IFieldMeta[] = [];
    for (const fieldType of Y_FIELD_TYPE) {
      yFieldMetaList = (await table.getFieldMetaListByType(fieldType)).concat(yFieldMetaList)
    }
    setXItemList(xFieldMetaList)
    setYItemList(yFieldMetaList);
  }

  const getFormatXValue = async (table: ITable, xFieldId: string) => {
    const xField = await table.getField<IDateTimeField>(xFieldId);
    const xFieldValue = await xField.getFieldValueList();
    const xVal: { recordId: string, value: IOpenNumber }[] = [];
    // x 轴需要先进行过滤
    for (const val of xFieldValue) {
      if (val.record_id && val.value) {
        xVal.push({ recordId: val.record_id, value: val.value as IOpenNumber })
      }
    }
    return xVal
  }

  const getFormatYValue = async (table: ITable, yFieldId: string) => {
    const yField = await table.getField(yFieldId);
    const yFieldValue = await yField.getFieldValueList();
    const yFormatVal = new Map<string, number>();
    for (const val of yFieldValue) {
      if (val.record_id) {
        yFormatVal.set(val.record_id, (val.value as IOpenNumber) || 0)
      }
    }
    return yFormatVal;
  }

  const formatChartData = async () => {
    if (!xFieldId || !yFieldId) return;
    const table = await bitable.base.getActiveTable();
    const xVal = await getFormatXValue(table, xFieldId);
    const yFormatVal = await getFormatYValue(table, yFieldId);
    const xSortedVal = xVal.sort((a, b) => a.value - b.value);
    const data: { [X_Field_KEY]: string, [Y_Field_KEY]: number }[] = [];
    for (const val of xSortedVal) {
      data.push({
        [X_Field_KEY]: moment(val.value).format(dateType),
        [Y_Field_KEY]: yFormatVal.get(val.recordId) || 0,
      })
    }
    return data;
  }

  const renderChart = debounce(async () => {
    setLoadingChart(true);
    if (!chartContainer.current) {
      setLoadingChart(false);
      return;
    }
    const dataValue = await formatChartData();
    if (!dataValue) {
      setLoadingChart(false);
      return;
    }
    chartInstance?.destroy();
    const chartWidth = chartContainer.current.clientWidth;
    const chartHeight = chartContainer.current.clientHeight;
    const Chart = ChartMap[chartType]
    const chart = new Chart(chartContainer.current, {
      data: dataValue,
      padding: 'auto',
      xField: X_Field_KEY,
      yField: Y_Field_KEY,
      width: chartWidth,
      height: chartHeight,
    });
    chart.render();
    setChartInstance(chart);
    setLoadingChart(false);
  }, 200);

  const onListenValueChange = async () => {
    const table = await bitable.base.getActiveTable();
    table.onRecordAdd(() => {
      renderChart()
    });
    table.onRecordModify(() => renderChart());
    table.onRecordDelete(() => renderChart());
  }

  useEffect(() => {
    renderChart();
  }, [xFieldId, yFieldId, chartType, dateType]);

  useEffect(() => {
    bitable.base.onSelectionChange(fetchXYItemList);
    bitable.base.onSelectionChange(() => renderChart());
    onListenValueChange();
    fetchXYItemList();
  }, []);

  const hasSelect = () => {
    return chartType && xFieldId && yFieldId;
  }


  return <>
    <Form>
      <div style={{ display: 'flex ' }}>
        <Form.Item required className={'field-form-item'}
                   label={<Alert className={'field-form-alert'} message={t('SelectXField')}/>}
        >
          <Select
            style={{ width: 200 }}
            options={xItemList.map(item => ({ value: item.id, label: item.name }))}
            onSelect={setXFieldId}
          />
        </Form.Item>
        <Form.Item className={'field-form-item'}
                   label={<Alert className={'field-form-alert'} message={t('SelectChartType')} type={'success'}/>}

                   style={{ marginLeft: 12 }}
                   >
          <Select
            defaultValue={ChartType.Column}
            style={{ width: 120 }}
            options={Object.keys(ChartMap).map(chartKey => ({ value: chartKey, label: t(chartKey) }))}
            onSelect={chartKey => setChartType(chartKey as ChartType)}
          />
        </Form.Item>
      </div>
      <div style={{ display: 'flex' }}>
        <Form.Item className={'field-form-item'}
                   label={<Alert className={'field-form-alert'} message={t('SelectYField')}/>}
                   style={{ marginTop: 12 }}
                   required
        >
          <Select
            style={{ width: 200 }}
            options={yItemList.map(item => ({ value: item.id, label: item.name }))}
            onSelect={setYFieldId}
          />
        </Form.Item>
        <Form.Item className={'field-form-item'}
                   label={<Alert className={'field-form-alert'} message={t('SelectDate')} type={'success'}/>}
                   style={{ marginTop: 12, marginLeft: 12 }}>
          <Select
            defaultValue={t(DATE_KEY.Day)}
            style={{ width: 120 }}
            options={Object.keys(DATE_FORMATTER).map(date => ({ value: DATE_FORMATTER[date as DATE_KEY], label: t(date) }))}
            onSelect={setDateType}
          />
        </Form.Item>
      </div>
    </Form>
    {
      hasSelect() ? (
        <Spin spinning={loadingChart}>
          <div className={'chart-container'} ref={chartContainer}/>
        </Spin>
      ) : (
        <Alert showIcon type={'warning'} message={t('info')} style={{ marginTop: 15 }}/>
      )
    }
  </>
}