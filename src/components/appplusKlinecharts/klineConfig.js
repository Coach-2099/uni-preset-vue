// 适配 KLineCharts 10.x 的样式配置示例
export const config = {
  grid: {
    show: true,
    horizontal: {
      show: true,
      size: 1,
      color: '#D2C7F4',
      style: 'dash',
      dashValue: [2, 2]
    },
    vertical: {
      show: true,
      size: 1,
      color: '#D2C7F4',
      style: 'dash',
      dashValue: [2, 2]
    }
  },
  candle: {
    margin: {
      top: 0.2,
      bottom: 0.1
    },
    type: 'candle_solid',
    bar: {
      upColor: '#55D252',
      downColor: '#F0665D',
      noChangeColor: '#888888'
    },
    tooltip: {
      showRule: 'always',
      showType: 'standard',
      labels: ['时间', '开', '收', '高', '低', '成交量'],
      values: null
    }
  },
  indicator: {
    bars: {
      upColor: '#55D252',
      downColor: '#F0665D',
      noChangeColor: '#888888'
    },
    lines: [
      { color: '#FF9500', size: 1 },
      { color: '#9575CD', size: 1 }
    ]
  },
  xAxis: {
    show: true,
    axisLine: {
      show: true,
      color: '#C583ED',
      size: 1
    },
    tickText: {
      show: true,
      color: '#A3A3A3',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12
    }
  },
  yAxis: {
    show: true,
    position: 'right',
    type: 'normal',
    inside: true,
    axisLine: {
      show: false,
      color: '#D2C7F4',
      size: 1
    },
    tickText: {
      show: true,
      color: '#A3A3A3',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12
    }
  },
  crosshair: {
    show: true,
    horizontal: {
      show: true,
      line: {
        show: true,
        style: 'dash',
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderSize: 1,
        borderColor: '#505050',
        borderRadius: 2,
        backgroundColor: '#505050'
      }
    },
    vertical: {
      show: true,
      line: {
        show: true,
        style: 'dash',
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderSize: 1,
        borderColor: '#505050',
        borderRadius: 2,
        backgroundColor: '#505050'
      }
    }
  }
}