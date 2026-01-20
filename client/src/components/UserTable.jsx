import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Table, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/UserTable.css";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const usersPerPage = 20;
  const navigate = useNavigate();

  // Fetch Users with token in header
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5001/api/getusers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        // Normalize response to always be an array
        let data = await response.json();
        if (data?.users) data = data.users;
        if (!Array.isArray(data)) data = [data];

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        navigate("/login");
      }
    };

    fetchUsers();
  }, [navigate]);

  // Filter users based on search & role selection
  const filteredUsers = (users || []).filter((user) => {
    // make username/email safe for toLowerCase
    const username = (user?.username || "").toString().toLowerCase();
    const email = (user?.email || "").toString().toLowerCase();
    const term = (searchTerm || "").toString().toLowerCase();

    return (
      (selectedRole === "All" || user?.role === selectedRole) &&
      (username.includes(term) || email.includes(term))
    );
  });

  // Delete Confirmation Modal
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Delete User from Database
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/deleteuser/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user.id !== selectedUser.id));
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      toast.error("Error deleting user.");
      console.error("Error:", error);
    }

    setShowModal(false);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="table-container">
      {/* Search, Filter and Create */}
      <div className="filters">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
        </Form.Select>
        <Button
          variant="primary"
          className="add-user-btn"
          onClick={() => navigate("/dashboard/dashboardusers/createuser")}
        >
          <img
            src={process.env.PUBLIC_URL + "/img/add.svg"}
            alt="Add"
            className="add-icon"
          />
        </Button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="wide-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="edit-btn"
                      variant="warning"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/dashboardusers/updateuser/${user.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
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
            Are you sure you want to delete "{selectedUser?.email}"?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cancel-btn"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button className="delete-btn" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <Button
          variant="secondary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <img
            src={process.env.PUBLIC_URL + "/img/previous.svg"}
            alt="Previous"
            className="add-icon"
          />
        </Button>
        <span> Page {currentPage} </span>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={indexOfLastUser >= filteredUsers.length}
        >
          <img
            src={process.env.PUBLIC_URL + "/img/next.svg"}
            alt="next"
            className="add-icon"
          />
        </Button>
      </div>
    </div>
  );
};

export default UserTable;
