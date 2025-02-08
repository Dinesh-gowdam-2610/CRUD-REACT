import axios from "axios";

const API_URL = "http://localhost:3000/user"; // Replace with your API URL
console.log("API_URL", process.env.BASE_URL);
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`, // Adding the authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUsers = async (dataObject, token) => {
  try {
    const response = await axios.put(`${API_URL}/updateUser`, dataObject, {
      headers: {
        Authorization: `Bearer ${token}`, // Adding the authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (dataObject, token) => {
  try {
    const { email, phoneNumber } = dataObject;
    const isEmail = email.includes("@");
    const queryStringParams = isEmail
      ? `email=${email}`
      : `phoneNumber=${phoneNumber}`;
    const response = await axios.delete(
      `${API_URL}/deleteUser?${queryStringParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adding the authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserToken = async (identifier) => {
  try {
    const isEmail = identifier.includes("@");
    const queryParam = isEmail
      ? `email=${identifier}`
      : `phoneNumber=${identifier}`;
    const response = await axios.get(`${API_URL}/getUserToken?${queryParam}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
