import React from "react";
import "../styles/Modal.css";

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="modal-buttons">
          <button className="delete-btn" onClick={onDelete}>
            Delete
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
