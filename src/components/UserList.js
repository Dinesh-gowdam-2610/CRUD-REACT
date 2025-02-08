import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getAllUsers, updateUsers, deleteUser } from "../services/api";
import EditModal from "../modals/EditModal";
import DeleteModal from "../modals/DeleteModal";

import "../styles/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const history = useHistory();
  const location = useLocation();
  const token = location.state?.token || localStorage.getItem("token"); // Retrieve token from location state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError("No token found. Please log in.");
          history.push("/login"); // Redirect to login page
          return;
        }
        const data = await getAllUsers(token); // Pass token to getAllUsers
        setUsers(data);

        // Set a timeout to clear the token after 5 minutes (300000 milliseconds)
        const timeoutId = setTimeout(() => {
          setError("Session expired. Please log in again.");
          history.push("/login"); // Redirect to login page
        }, 300000);

        // Clear the timeout if the component is unmounted
        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, [token, history]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    const modfiedUser = {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    setEditedUser(modfiedUser);
    setIsModalOpen(true);
  };

  const handleSaveClick = async () => {
    try {
      // Call the updateUsers API with the edited user details and token
      await updateUsers(
        {
          userId: selectedUser._id, // Ensure the correct user ID is being used
          username: editedUser.username,
          email: editedUser.email,
          phoneNumber: editedUser.phoneNumber,
        },
        token
      );

      // Update the local state with the edited user details
      setUsers(
        users.map((user) => (user._id === selectedUser._id ? editedUser : user))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response || error.message || error
      );
      // Set a timeout to clear the token after 5 minutes (300000 milliseconds)
      const timeoutId = setTimeout(() => {
        setError("Failed to update user. Please try again later.");
      }, 3000);

      // Clear the timeout if the component is unmounted
      return () => clearTimeout(timeoutId);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // Call the deleteUser API with the selected user ID and token
      await deleteUser(selectedUser, token);

      // Update the local state to remove the deleted user
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response || error.message || error
      );
      const timeoutId = setTimeout(() => {
        setError("Failed to delete user. Please try again later.");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleLoginRedirect = () => {
    history.push("/login");
  };

  return (
    <div className="user-list-container">
      {error && <div className="error-message">{error}</div>}
      {users.length === 0 ? (
        <div className="empty-message">
          Dashboard is empty. No data available.
          <button className="login-btn" onClick={handleLoginRedirect}>
            Go to Login
          </button>
        </div>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-card">
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className="email">{user.email}</span>
                <span className="phone">{user.phoneNumber}</span>
              </div>
              <div className="user-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Edit User</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={editedUser.username}
            onChange={(e) =>
              setEditedUser({ ...editedUser, username: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={editedUser.email}
            onChange={(e) =>
              setEditedUser({ ...editedUser, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={editedUser.phoneNumber}
            onChange={(e) =>
              setEditedUser({ ...editedUser, phoneNumber: e.target.value })
            }
          />
          <button type="button" onClick={handleSaveClick}>
            Save
          </button>
        </form>
      </EditModal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default UserList;
