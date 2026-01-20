import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement
);

const COLOR_PRIMARY = '#cb3694';
const COLOR_BACKGROUND = '#FFFFFF';
const COLOR_TEXT_DARK = '#333333';
const COLOR_ACCENT_GRAY = '#f8f9fa';

const UserAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        const response = await fetch("http://localhost:5001/api/getusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) { navigate("/login"); return; }
        if (!response.ok) { throw new Error('Failed to fetch users'); }
        let data = await response.json();
        if (data?.users) data = data.users;
        setUsers(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        toast.error("Failed to fetch user data for analytics.");
      }
    };
    fetchUsers();
  }, [navigate]);

  const analyticsData = useMemo(() => {
    const adminCount = users.filter(user => user.role === "Admin").length;
    const editorCount = users.filter(user => user.role === "Editor").length;
    const regularUserCount = users.length - adminCount - editorCount;

    const registrationsByDay = users.reduce((acc, user) => {
        if (user.created_at) {
            const dateKey = new Date(user.created_at).toISOString().split('T')[0];
            acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
    }, {});

    const sortedDates = Object.keys(registrationsByDay).sort();
    const registrationData = sortedDates.map(date => registrationsByDay[date]);


    return {
      stats: { total: users.length, admin: adminCount, editor: editorCount },
      pieChart: {
        labels: ['Admins', 'Editors', 'Regular Users'],
        datasets: [{
          label: '# of Users',
          data: [adminCount, editorCount, regularUserCount],
          backgroundColor: [ COLOR_PRIMARY, 'rgba(100, 100, 100, 0.7)', 'rgba(180, 180, 180, 0.5)' ],
          borderColor: [ COLOR_BACKGROUND, COLOR_BACKGROUND, COLOR_BACKGROUND ],
          borderWidth: 2,
        }],
      },
      lineChart: {
        labels: sortedDates,
        datasets: [{
            label: 'New Signups',
            data: registrationData,
            fill: true,
            borderColor: COLOR_PRIMARY,
            backgroundColor: 'rgba(203, 54, 148, 0.1)',
            tension: 0.4,
            pointBackgroundColor: COLOR_PRIMARY
        }]
      }
    };
  }, [users]);

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
    <div className="user-analytics-container p-4" style={{ backgroundColor: COLOR_BACKGROUND, color: COLOR_TEXT_DARK }}>
      <h2>User Analytics</h2>
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm" style={{ borderColor: COLOR_ACCENT_GRAY }}>
            <Card.Body>
              <Card.Title style={{ color: COLOR_TEXT_DARK }}>Total Users</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLOR_PRIMARY }}>
                {analyticsData.stats.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm" style={{ borderColor: COLOR_ACCENT_GRAY }}>
            <Card.Body>
              <Card.Title style={{ color: COLOR_TEXT_DARK }}>Admins</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLOR_PRIMARY }}>
                {analyticsData.stats.admin}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm" style={{ borderColor: COLOR_ACCENT_GRAY }}>
            <Card.Body>
              <Card.Title style={{ color: COLOR_TEXT_DARK }}>Editors</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLOR_PRIMARY }}>
                {analyticsData.stats.editor}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6}>
            <Card className="shadow-sm h-100" style={{ borderColor: COLOR_ACCENT_GRAY }}>
                <Card.Header style={{ backgroundColor: COLOR_ACCENT_GRAY, color: COLOR_TEXT_DARK }}>User Role Distribution</Card.Header>
                <Card.Body>
                    {users.length > 0 ? (
                        <div style={{ height: '300px' }}>
                            <Pie data={analyticsData.pieChart} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-center">No data to display in chart.</p>
                    )}
                </Card.Body>
            </Card>
        </Col>
        <Col xs={12} lg={6}>
            <Card className="shadow-sm h-100" style={{ borderColor: COLOR_ACCENT_GRAY }}>
                <Card.Header style={{ backgroundColor: COLOR_ACCENT_GRAY, color: COLOR_TEXT_DARK }}>Sign-ups Over Time</Card.Header>
                <Card.Body>
                    {users.length > 0 ? (
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

export default UserAnalytics;
