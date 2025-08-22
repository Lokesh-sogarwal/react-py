import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Chart() {
  const [chartData, setChartData] = useState({ dates: [], counts: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/auth/addblog", {
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

        // ✅ Backend returns [blogsArray, count]
        const blogs = rawData.blogs||"";

        const dateCounts = {};
        blogs.forEach(blog => {
          if (!blog.created_at) return;
          const date = new Date(blog.created_at);
          if (isNaN(date)) return;
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
    title: { text: 'Blogs Created Over Time' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData.dates,
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Blogs',
        type: 'bar',
        data: chartData.counts,
        barWidth: 25,
        itemStyle: { color: '#4B6EC0' },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "350px", width: "100%" }} />;
}
