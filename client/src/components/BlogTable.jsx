import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Table, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/BlogTable.css";

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedCategory, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const blogsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // try multiple likely keys
        const token =localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch("http://localhost:5001/api/getblogs", {
          headers,
        });

        // handle unauthorized explicitly
        if (response.status === 401 || response.status === 403) {
          const errJson = await safeJson(response);
          const msg = errJson?.error || errJson?.message || "Unauthorized";
          toast.error(msg);
          navigate("/login");
          return;
        }

        let data = await response.json();

        // normalize response
        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (data?.blogs) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs.");
      }
    };

    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // helper to read json safely
  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const filteredBlogs = (blogs || []).filter((blog) => {
    const matchesSearch =
      (blog.title ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase()) ||
      (blog.author ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const confirmDelete = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;

    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt") ||
        null;

      const response = await fetch(
        `http://localhost:5001/api/deleteblog/${selectedBlog.id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.status === 401 || response.status === 403) {
        const errJson = await safeJson(response);
        const msg = errJson?.error || errJson?.message || "Unauthorized";
        toast.error(msg);
        navigate("/login");
        setShowModal(false);
        return;
      }

      if (response.ok) {
        toast.success("Blog deleted successfully!");
        setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      } else {
        const errJson = await safeJson(response);
        const msg = errJson?.error || "Failed to delete blog.";
        toast.error(msg);
      }
    } catch (error) {
      toast.error("Error deleting blog.");
      console.error("Error:", error);
    }

    setShowModal(false);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const nextPage = () => {
    if (indexOfLastBlog < filteredBlogs.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="table-container">
      <div className="filters">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Form.Select value={selectedCategory} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Lifestyle">Lifestyle</option>
        </Form.Select>

        <Button
          variant="primary"
          className="add-blog-btn"
          onClick={() => navigate("/dashboard/dashboardblog/createblog")}
        >
          <img src={process.env.PUBLIC_URL + "/img/add.svg"} alt="Add" className="add-icon" />
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="wide-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.id}</td>
                  <td>{blog.title}</td>
                  <td>{blog.created_by}</td>
                  <td>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "-"}</td>
                  <td>{blog.category}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/dashboard/dashboardblog/updateblog/${blog.id}`)}
                    >
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => confirmDelete(blog)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No blogs found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Delete Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete "{selectedBlog?.title}"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="pagination">
        <Button variant="secondary" onClick={prevPage} disabled={currentPage === 1}>
          <img src={process.env.PUBLIC_URL + "/img/previous.svg"} alt="Previous" className="add-icon" />
        </Button>

        <span> Page {currentPage} </span>

        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={indexOfLastBlog >= filteredBlogs.length}
        >
          <img src={process.env.PUBLIC_URL + "/img/next.svg"} alt="Next" className="add-icon" />
        </Button>
      </div>
    </div>
  );
};

export default BlogTable;
