import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./page/ExamplePage";
// create route
function App() {
  const [id, setId] = useState("");
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [toggle, setToggle] = useState(false);

  const fetchTodo = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      setTodo(response.data);
      setId("");
    } catch (error) {
      console.error("Error fetching todo:", error);
      alert("Failed to fetch data");
    }
    setLoading(false);
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchTodo();
      saveToDatabase();
    }
  };

  const saveToDatabase = async () => {
    if (!todo) return;
    try {
      await axios.post("https://backend-mern-two.vercel.app/api/add", {
        userId: todo.userId,
        title: todo.title,
      });
      displayData();
      fetchTodo();
      setTodo();
      // setTodo({ userId: "", title: "" });
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save");
    }
  };

  const displayData = async () => {
    try {
      const res = await axios.get(
        "https://backend-mern-two.vercel.app/api/get"
      );
      setResult(res.data);
    } catch (err) {
      console.error("Error fetching todo:", err);
    }
  };

  const toggleStage = () => {
    displayData();
    setToggle((prev) => !prev);
  };

  const handleDelete = async (id) => {
    try {
      confirm("sure delete");
      await axios.delete(
        "https://backend-mern-two.vercel.app/api/delete/" + id
      );
      setResult(result.filter((re) => re._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (result.length === 0) return 0;
    if (confirm("Are you sure you want to delete ALL data?")) {
      try {
        await axios.delete(
          "https://backend-mern-two.vercel.app/api/deletedataall"
        ); // Dedicated route for deleting all
        fetchTodo(); // Refresh data after deletion
        displayData();

        // alert("All data deleted successfully!");
      } catch (error) {
        console.error("Error deleting all data:", error);
        alert("Error deleting all data. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fetch and Store Todo</h2>
      <input
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onKeyDown={(e) => handleEnter(e)}
        placeholder="Enter ID"
      />

      <button
        onClick={fetchTodo}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Loading..." : "Fetch Todo"}
      </button>
      {result && (
        <button className="btn btn-warning" onClick={toggleStage}>
          {toggle ? "hide data" : "show data"}
        </button>
      )}
      {todo && (
        <button onClick={saveToDatabase} className="btn btn-success">
          Save to Database
        </button>
      )}
      {todo && (
        <div className="w-50 border p-2">
          <h3>Todo Details</h3>
          <p>
            <strong>User ID:</strong> {todo.userId}
          </p>
          <p>
            <strong>Title:</strong> {todo.title}
          </p>
          {/* <button
                        onClick={saveToDatabase}
                        className="btn btn-success"
                        >
                        Save to Database
                        </button> */}
        </div>
      )}
      {/* <button onClick={displayData} className="btn btn-primary">
                view data
                </button> */}

      {result && toggle ? (
        <div className="container">
          {/* <button
                        onClick={handleDeleteAll}
                        className="btn btn-danger"
                    >
                        Delete All
                    </button> */}
          <div className="d-flex justify-content-between">
            <h3>View data</h3>
            <button onClick={handleDeleteAll} className="btn btn-danger">
              Delete All
            </button>
          </div>
          <table className="table table-hover ">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody>
              {result &&
                result.map((e, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.title}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => handleDelete(e._id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default App;
