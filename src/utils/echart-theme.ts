import * as echarts from 'echarts';

echarts.registerTheme('myTheme', {
    "color": [
        "#9b8bba",
        "#e098c7",
        "#8fd3e8",
        "#71669e",
        "#cc70af",
        "#7cb4cc",
        "#fc97af",
        "#87f7cf",
        "#f7f494",
        "#72ccff",
        "#f7c5a0",
        "#d4a4eb",
        "#d2f5a6",
        "#76f2f2"
    ],
    "bar": {
        "itemStyle": {
            "barBorderWidth": 0,
            "barBorderColor": "#ccc"
        }
    },
    "pie": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
  });

export default  echarts;