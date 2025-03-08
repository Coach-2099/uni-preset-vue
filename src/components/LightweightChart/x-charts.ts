import { createChart } from 'lightweight-charts';
const stickOption = {
  localization: {
    locale: 'en-US'
  },
  layout: {
    textColor: 'black',
    background: { type: 'solid', color: 'white' }
  },
  timeScale: {
    borderColor: '#F5F5F5',
    timeZone: 'Etc/UTC'
  },
  height: 400
};
 
// 创建k线图
let stickChart: any = null;
const stickChartInit = (domId: string) => {
  stickChart = createChart(
    document.getElementById(domId) as HTMLElement,
    stickOption as any
  );
};
 
// 渲染k线图
let stickSeries: any = null;
const stickSyncToInterval = (data: any) => {
  if (stickSeries) {
    stickChart.removeSeries(stickSeries);
    stickSeries = null;
  }
  stickSeries = stickChart.addCandlestickSeries({
    upColor: '#18B762',
    downColor: '#E8503A',
    borderVisible: false,
    wickUpColor: '#18B762',
    wickDownColor: '#E8503A'
  });
  stickSeries.setData(data);
  stickChart.timeScale().fitContent();
};
 
// 清除
const closeCharts = () => {
  stickSeries = null;
};
 
export default {
  stickChartInit,
  stickSyncToInterval,
  closeCharts
};