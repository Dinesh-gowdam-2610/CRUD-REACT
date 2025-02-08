// filepath: /c:/Dinesh/Vscode/REACT-NODE-SIGNUP-CRUD/src/components/Modal.js
import React from "react";
import "../styles/EditModal.css";

const EditModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default EditModal;
