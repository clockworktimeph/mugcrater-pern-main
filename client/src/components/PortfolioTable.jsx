import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Table, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/PortfolioTable.css";

// Helper function to ensure URLs are absolute for opening in new tabs
const makeAbsoluteUrl = (url) => {
  if (!url) return null;
  // Check if the URL already starts with http:// or https://
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Otherwise, prepend https://
  return `https://${url}`;
};

const PortfolioTable = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [selectedCategory, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const portfoliosPerPage = 10;
  const navigate = useNavigate();

  // Fetch Portfolios
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5001/api/getportfolios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = await response.json();

        // Normalize to always be an array
        if (data?.portfolios) data = data.portfolios;
        if (!Array.isArray(data)) data = [data];

        setPortfolios(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        toast.error("Failed to fetch portfolios.");
      }
    };

    fetchPortfolios();
  }, []);

  // Search
  const filteredPortfolios = (portfolios || []).filter((portfolio) =>
    (selectedCategory === "All" || portfolio.category === selectedCategory) &&
    (portfolio.title ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase())
  );

  // Handle Create
  const handleCreate = () => {
    navigate("/dashboard/dashboardportfolio/createportfolio");
  };

  // Confirm Delete
  const confirmDelete = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowModal(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedPortfolio) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/deleteportfolio/${selectedPortfolio.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Portfolio deleted successfully!");
        setPortfolios((prev) =>
          prev.filter((portfolio) => portfolio.id !== selectedPortfolio.id)
        );
      } else {
        toast.error("Failed to delete portfolio.");
      }
    } catch (error) {
      toast.error("Error deleting portfolio.");
      console.error("Error:", error);
    }

    setShowModal(false);
  };

  // Pagination Logic
  const indexOfLastPortfolio = currentPage * portfoliosPerPage;
  const indexOfFirstPortfolio = indexOfLastPortfolio - portfoliosPerPage;
  const currentPortfolios = filteredPortfolios.slice(
    indexOfFirstPortfolio,
    indexOfLastPortfolio
  );

  const nextPage = () => {
    if (indexOfLastPortfolio < filteredPortfolios.length) {
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
        <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <Form.Select value={selectedCategory} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Bubble.io">Bubble.io</option>
          <option value="API">API</option>
        </Form.Select>
        <Button variant="primary" className="add-portfolio-btn" onClick={handleCreate}>
          <img src={process.env.PUBLIC_URL + "/img/add.svg"} alt="Add" className="add-icon"/>
        </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover className="wide-table">
          <thead>
            <tr>
              <th>ID</th>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th> {/* Changed empty header to Actions */}
            </tr>
          </thead>
          <tbody>
            {currentPortfolios.length > 0 ? (
              currentPortfolios.map((portfolio) => (
                <tr key={portfolio.id}>
                  <td>{portfolio.id}</td>
                  <td style={{ verticalAlign: "middle" }}>
                    {portfolio.url && (
                        /* FIXED: Use absolute URL and an <a> tag for semantics */
                        <a href={makeAbsoluteUrl(portfolio.url)} target="_blank" rel="noopener noreferrer">
                            <img src={process.env.PUBLIC_URL + "/img/link.svg"} alt="Link to portfolio" style={{ cursor: "pointer" }}/>
                            {console.log(`http://localhost:5001/uploads/portfolio/${portfolio.image}`)}
                        </a>
                    )}
                  </td>
                  <td>{portfolio.title || "No title"}</td>
                  <td>{portfolio.description?.substring(0, 100) || "No description"}...</td>
                  <td>{portfolio.category}</td>
                  <td>
                    <button className="edit-btn" onClick={() => navigate(`/dashboard/dashboardportfolio/updateportfolio/${portfolio.id}`)}> Edit </button>
                    <button className="delete-btn" onClick={() => confirmDelete(portfolio)}> Delete </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center"> {/* Updated colspan to 6 */}
                  No portfolios found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedPortfolio?.title || "this portfolio"}"?
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
      <div className="pagination">
        <Button variant="secondary" onClick={prevPage} disabled={currentPage === 1}>
          <img src={process.env.PUBLIC_URL + "/img/previous.svg"} alt="Previous" className="add-icon"/>
        </Button>
        <span> Page {currentPage} </span>
        <Button variant="secondary" onClick={nextPage} disabled={indexOfLastPortfolio >= filteredPortfolios.length}>
          <img src={process.env.PUBLIC_URL + "/img/next.svg"} alt="Next" className="add-icon"/>
        </Button>
      </div>
    </div>
  );
};

export default PortfolioTable;
