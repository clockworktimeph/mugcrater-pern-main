import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
    Chart as ChartJS, 
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement
);

const COLOR_PRIMARY = '#cb3694';
const COLOR_BACKGROUND = '#FFFFFF';
const COLOR_TEXT_DARK = '#333333';
const COLOR_ACCENT_GRAY = '#f8f9fa';

const dynamicColors = [
    COLOR_PRIMARY,
    '#6c757d', '#17a2b8', '#28a745', '#ffc107', '#dc3545', '#007bff',
];

const PortfolioAnalytics = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Portfolios data (FIXED LOGIC)
  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
           navigate("/login"); 
           return; 
        }

        const response = await fetch("http://localhost:5001/api/getportfolios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
            navigate("/login");
            return;
        }

        if (!response.ok) { throw new Error('Failed to fetch portfolios.'); }
        
        let data = await response.json();
        if (data?.portfolios) data = data.portfolios;
        setPortfolios(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching portfolios:", error);
        toast.error("Failed to fetch portfolio data for analytics.");
      }
    };
    fetchPortfolios();
  }, [navigate]); 

  const analyticsData = useMemo(() => {
    const totalPortfolios = portfolios.length;

    const categoriesCount = portfolios.reduce((acc, portfolio) => {
        const category = portfolio.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
    const categoryLabels = Object.keys(categoriesCount);
    const categoryDataPoints = Object.values(categoriesCount);
    const categoryColors = categoryLabels.map((_, index) => dynamicColors[index % dynamicColors.length]);

    const additionsByDay = portfolios.reduce((acc, portfolio) => {
        if (portfolio.createdAt) {
            const dateKey = new Date(portfolio.createdAt).toISOString().split('T')[0]; 
            acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
    }, {});
    const sortedDates = Object.keys(additionsByDay).sort();
    const additionData = sortedDates.map(date => additionsByDay[date]);


    return {
      stats: { total: totalPortfolios },
      barChart: {
        labels: categoryLabels,
        datasets: [{
          label: 'Portfolios per Category',
          data: categoryDataPoints,
          backgroundColor: categoryColors,
          borderColor: COLOR_TEXT_DARK,
          borderWidth: 1,
        }],
      },
      lineChart: {
        labels: sortedDates,
        datasets: [{
            label: 'New Portfolios Added',
            data: additionData,
            fill: true,
            borderColor: COLOR_PRIMARY,
            backgroundColor: 'rgba(203, 54, 148, 0.1)',
            tension: 0.4,
            pointBackgroundColor: COLOR_PRIMARY
        }]
      }
    };
  }, [portfolios]);

  const chartOptions = { /* ... (same as before) ... */
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: COLOR_TEXT_DARK, boxWidth: 20 }
      },
      tooltip: {
        backgroundColor: COLOR_TEXT_DARK,
        titleColor: COLOR_BACKGROUND
      }
    },
    scales: {
        x: { 
            ticks: { color: COLOR_TEXT_DARK },
            grid: { color: 'rgba(51, 51, 51, 0.1)' }
        },
        y: { 
            ticks: { color: COLOR_TEXT_DARK },
            grid: { color: 'rgba(51, 51, 51, 0.1)' }
        }
    }
  };

  if (loading) return (<div className="text-center p-5"><Spinner animation="border" role="status" style={{color: COLOR_PRIMARY}}/></div>);
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <div className="portfolio-analytics-container p-4" style={{ backgroundColor: COLOR_BACKGROUND, color: COLOR_TEXT_DARK }}>
      <h2>Portfolio Analytics</h2>
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm" style={{ borderColor: COLOR_ACCENT_GRAY }}>
            <Card.Body>
              <Card.Title style={{ color: COLOR_TEXT_DARK }}>Total Portfolios</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLOR_PRIMARY }}>
                {analyticsData.stats.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6}>
            <Card className="shadow-sm h-100" style={{ borderColor: COLOR_ACCENT_GRAY }}>
                <Card.Header style={{ backgroundColor: COLOR_ACCENT_GRAY, color: COLOR_TEXT_DARK }}>Portfolios by Category</Card.Header>
                <Card.Body>
                    {portfolios.length > 0 ? (
                        <div style={{ height: '300px' }}>
                            <Bar data={analyticsData.barChart} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-center">No data to display in chart.</p>
                    )}
                </Card.Body>
            </Card>
        </Col>
        <Col xs={12} lg={6}>
            <Card className="shadow-sm h-100" style={{ borderColor: COLOR_ACCENT_GRAY }}>
                <Card.Header style={{ backgroundColor: COLOR_ACCENT_GRAY, color: COLOR_TEXT_DARK }}>Additions Over Time</Card.Header>
                <Card.Body>
                    {portfolios.length > 0 ? (
                        <div style={{ height: '300px' }}>
                            <Line data={analyticsData.lineChart} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-center">No data to display in chart.</p>
                    )}
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PortfolioAnalytics;
