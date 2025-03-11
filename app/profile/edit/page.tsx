"use client";

import { useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    dob: "",
    sex: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/updateuser", formData);

      if (response.status === 200) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      console.log("API error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="max-w-md mt-8 mx-auto p-4 border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
        />

        <label className="block mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />

        <label className="block mb-2" htmlFor="dob">
          Date of Birth
        </label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <label className="block mb-2" htmlFor="sex">
          Sex
        </label>
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:cursor hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
