"use client";

import { useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/updateuser", { name });

      if (response.status === 200) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Name</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          className="w-full p-2 border border-gray rounded"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter Your Name"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:cursor"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
