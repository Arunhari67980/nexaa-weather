import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import '../styles/ForecastChart.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function ForecastChart({ data, unit }) {
  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  // Process data for temperature and precipitation
  const processedData = data.list.reduce((acc, item, idx) => {
    if (idx % 8 === 0) {
      const date = new Date(item.dt * 1000)
      acc.labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
      acc.temps.push(Math.round(item.main.temp))
      acc.humidity.push(item.main.humidity)
      acc.rain.push(item.rain?.['3h'] || 0)
    }
    return acc
  }, { labels: [], temps: [], humidity: [], rain: [] })

  const tempChartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: `Temperature (${tempSymbol})`,
        data: processedData.temps,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Humidity (%)',
        data: processedData.humidity,
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#4ecdc4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }

  const rainChartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: processedData.rain,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: '#3498db',
        borderWidth: 1,
      },
    ],
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: { size: 12, weight: 'bold' },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#aaa',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#aaa',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  }

  return (
    <div className="forecast-charts">
      <div className="chart-container">
        <h3>5-Day Temperature & Humidity Forecast</h3>
        <Line data={tempChartData} options={commonOptions} />
      </div>

      <div className="chart-container">
        <h3>Expected Rainfall</h3>
        <Bar data={rainChartData} options={commonOptions} />
      </div>
    </div>
  )
}
