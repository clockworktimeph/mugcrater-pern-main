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

// Register the necessary components for ChartJS
ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement
);

// Define your color palette and additional shades for variety
const COLOR_PRIMARY = '#cb3694'; // Magenta
const COLOR_BACKGROUND = '#FFFFFF';
const COLOR_TEXT_DARK = '#333333';
const COLOR_ACCENT_GRAY = '#f8f9fa';

// A palette of colors to cycle through for different categories
const dynamicColors = [
    COLOR_PRIMARY,
    '#6c757d', // Medium Gray
    '#17a2b8', // Info Blue
    '#28a745', // Success Green
    '#ffc107', // Warning Yellow
    '#dc3545', // Danger Red
    '#007bff', // Primary Blue
];

const BlogAnalytics = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper to read json safely
  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  // Fetch Blogs data
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch("http://localhost:5001/api/getblogs", {
          headers,
        });

        // Handle unauthorized explicitly
        if (response.status === 401 || response.status === 403) {
          const errJson = await safeJson(response);
          const msg = errJson?.error || errJson?.message || "Unauthorized";
          toast.error(msg);
          navigate("/login");
          return;
        }
        
        let data = await response.json();

        if (Array.isArray(data)) {
            setBlogs(data);
        } else if (data?.blogs) {
            setBlogs(data.blogs);
        } else {
            setBlogs([]);
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blog data for analytics.");
      }
    };
    fetchBlogs();
  }, [navigate]); // Added navigate to dependency array

  // Prepare data for charts and stats
  const analyticsData = useMemo(() => {
    const totalBlogs = blogs.length;

    // --- Data processing for Bar Chart (Category Distribution) ---
    const categoriesCount = blogs.reduce((acc, blog) => {
        const category = blog.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const categoryLabels = Object.keys(categoriesCount);
    const categoryDataPoints = Object.values(categoriesCount);
    const categoryColors = categoryLabels.map((_, index) => dynamicColors[index % dynamicColors.length]);


    // --- Data processing for Line Chart (Additions over time) ---
    // Assumes blog objects have a 'created_at' timestamp field from the table code
    const additionsByDay = blogs.reduce((acc, blog) => {
        if (blog.created_at) {
            // Normalize date key to YYYY-MM-DD format
            const dateKey = new Date(blog.created_at).toISOString().split('T')[0];
            acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
    }, {});
    const sortedDates = Object.keys(additionsByDay).sort();
    const additionData = sortedDates.map(date => additionsByDay[date]);


    return {
      stats: { total: totalBlogs },
      barChart: {
        labels: categoryLabels,
        datasets: [{
          label: 'Blogs per Category',
          data: categoryDataPoints,
          backgroundColor: categoryColors,
          borderColor: COLOR_TEXT_DARK,
          borderWidth: 1,
        }],
      },
      lineChart: {
        labels: sortedDates,
        datasets: [{
            label: 'New Blogs Added',
            data: additionData,
            fill: true,
            borderColor: COLOR_PRIMARY,
            backgroundColor: 'rgba(203, 54, 148, 0.1)',
            tension: 0.4,
            pointBackgroundColor: COLOR_PRIMARY
        }]
      }
    };
  }, [blogs]);


  // Chart options for consistent minimalist look
  const chartOptions = {
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
    <div className="blog-analytics-container p-4" style={{ backgroundColor: COLOR_BACKGROUND, color: COLOR_TEXT_DARK }}>
      <h2>Blog Analytics</h2>
      <Row className="g-4 mb-4">
        {/* Total Blogs Card */}
        <Col md={4}>
          <Card className="shadow-sm" style={{ borderColor: COLOR_ACCENT_GRAY }}>
            <Card.Body>
              <Card.Title style={{ color: COLOR_TEXT_DARK }}>Total Blogs</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLOR_PRIMARY }}>
                {analyticsData.stats.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        {/* The Bar Chart Card (Category Distribution) */}
        <Col xs={12} lg={6}>
            <Card className="shadow-sm h-100" style={{ borderColor: COLOR_ACCENT_GRAY }}>
                <Card.Header style={{ backgroundColor: COLOR_ACCENT_GRAY, color: COLOR_TEXT_DARK }}>Blogs by Category</Card.Header>
                <Card.Body>
                    {blogs.length > 0 ? (
                        <div style={{ height: '300px' }}>
                            <Bar data={analyticsData.barChart} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-center">No data to display in chart.</p>
                    )}
                </Card.Body>
            </Card>
        </Col>

        {/* The Line Chart Card (Additions Over Time) */}
        <Col xs={12} lg={6}>
            <Card className="shadow-sm h-100" style={{ borderColor: COLOR_ACCENT_GRAY }}>
                <Card.Header style={{ backgroundColor: COLOR_ACCENT_GRAY, color: COLOR_TEXT_DARK }}>Additions Over Time</Card.Header>
                <Card.Body>
                    {blogs.length > 0 ? (
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

export default BlogAnalytics;
