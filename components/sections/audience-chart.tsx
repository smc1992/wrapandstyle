'use client';

import { useEffect, useRef } from 'react';
// @ts-ignore
import * as echarts from 'echarts';

const AudienceChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          textStyle: { color: '#1f2937' },
          borderWidth: 1,
          borderColor: '#e5e7eb'
        },
        legend: {
          top: '0%',
          left: 'center',
          textStyle: { color: '#374151' }
        },
        series: [
          {
            name: 'Besucherstruktur',
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: '20', fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: [
              { value: 42, name: 'Professionelle Folierer', itemStyle: { color: '#00D1C7' } },
              { value: 28, name: 'DIY-Enthusiasten', itemStyle: { color: '#5EEAD4' } },
              { value: 18, name: 'Fahrzeugbesitzer', itemStyle: { color: '#FDBA74' } },
              { value: 12, name: 'Händler & Hersteller', itemStyle: { color: '#FB923C' } }
            ]
          }
        ]
      };
      chart.setOption(option);

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default AudienceChart;
