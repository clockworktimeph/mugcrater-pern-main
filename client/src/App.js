import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./features/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogDetail from "./components/BlogDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import DashboardUsers from "./pages/DashboardUsers";
import CreateUser from "./pages/CreateUser";
import UpdateUser from "./pages/UpdateUser";
import DashboardPortfolio from "./pages/DashboardPortfolio";
import CreatePortfolio from "./pages/CreatePortfolio";
import UpdatePortfolio from "./pages/UpdatePortfolio";
import DashboardBlog from "./pages/DashboardBlog";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import DashboardSettings from "./pages/DashboardSettings";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-5 text-center">Verifying session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function AppContent() {
  const location = useLocation();
  const publicPages = ["/", "/about", "/portfolio", "/blog", "/contact"];
  const showHeader = publicPages.includes(location.pathname.toLowerCase());

  return (
    <>
      {showHeader && <Header />}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/DashboardUsers" element={<DashboardUsers />} />
          <Route path="/dashboard/DashboardUsers/CreateUser" element={<CreateUser />} />
          <Route path="/dashboard/DashboardUsers/UpdateUser/:id" element={<UpdateUser />} />
          <Route path="/dashboard/DashboardPortfolio" element={<DashboardPortfolio />} />
          <Route path="/dashboard/DashboardPortfolio/CreatePortfolio" element={<CreatePortfolio />} />
          <Route path="/dashboard/DashboardPortfolio/UpdatePortfolio/:id" element={<UpdatePortfolio />} />
          <Route path="/dashboard/DashboardBlog" element={<DashboardBlog />} />
          <Route path="/dashboard/DashboardBlog/CreateBlog" element={<CreateBlog />} />
          <Route path="/dashboard/DashboardBlog/UpdateBlog/:id" element={<UpdateBlog />} />
          <Route path="/dashboard/DashboardSettings" element={<DashboardSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
