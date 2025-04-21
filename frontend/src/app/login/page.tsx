"use client"
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
      body: JSON.stringify({ email, password }), // Send the data in JSON format
    });

    const data = await response.json();
    console.log(data); // Handle the backend response here
  };

  return (
    <div className="mb-44 mt-28 w-72 mx-auto justify-center border-2 border-gray-200 shadow-2xl">
      <div className="bg-blue-800 p-4 text-white mx-auto">
        <h2 className="w-32 mx-auto pl-2">Login Page</h2>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="gap-2 p-3">
          <h1>Enter email</h1>
          <input
            type="email"
            className="bg-gray-300 rounded-lg p-1"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Handle input changes
            required
          />
          <br />
        </div>
        <div className="gap-2 p-3">
          <h1>Enter password</h1>
          <input
            type="password"
            className="bg-gray-300 rounded-lg p-1"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Handle input changes
            required
          />
          <br />
        </div>
        <div className="bg-blue-800 p-4">
          <button type="submit" className="text-white w-56 mx-auto hover:cursor-pointer">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
