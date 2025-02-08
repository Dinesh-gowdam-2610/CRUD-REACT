// filepath: /c:/Dinesh/Vscode/userSignUpAndSignIn/my-react-app/src/components/UserItem.js
import React from "react";

const UserItem = ({ user }) => {
  return (
    <div className="user-item">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
    </div>
  );
};

export default UserItem;
