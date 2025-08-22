import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Chart() {
  const [chartData, setChartData] = useState({ dates: [], counts: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/auth/get_data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Error fetching chart data:", error);
          return;
        }

        const rawData = await res.json();
        console.log("Chart data fetched successfully:", rawData);

        // ✅ If backend returns [usersArray, count], pick usersArray
        const users = Array.isArray(rawData[0]) ? rawData[0] : rawData;

        const dateCounts = {};
        users.forEach(user => {
          if (!user.created_date) return; // skip missing
          const date = new Date(user.created_date);
          if (isNaN(date)) return; // skip invalid
          const formatted = date.toISOString().split('T')[0];
          dateCounts[formatted] = (dateCounts[formatted] || 0) + 1;
        });

        const dates = Object.keys(dateCounts).sort();
        const counts = dates.map(date => dateCounts[date]);

        setChartData({ dates, counts });
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, []);

  const option = {
    title: { text: 'Users Created Over Time' },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: chartData.dates,
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: chartData.counts,
        smooth: true,
        barWidth:30
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "350px", width: "100%" }} />;
}
