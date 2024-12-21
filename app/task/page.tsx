"use client";
import axios from "axios";
import { FormEvent, useState, useEffect } from "react";

interface Task {
  _id: string;
  task: string;
  createdAt: Date;
}

export default function Task() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.trim()) {
      alert("Task cannot be empty");
      return;
    }

    try {
      const response = await axios.post("/api/addtask", { task: task });
      setTasks([...tasks, response.data.task]);
      setTask("");
    } catch (error) {
      console.log("Error adding task,", error);
      alert("Error adding task");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/showtask");
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <>
      <div className="mt-4 p-4">
        <h1>Add Task</h1>
        <form className="mt-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border p-2 border-blue-400 rounded-sm mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold rounded-sm px-4 py-2 hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        <div className="mt-4">
          <h2 className="text-lg font-bold">Task List</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <ul className="mt-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex justify-between items-center border p-2 rounded-sm mb-2"
                >
                  <span>{task.task}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      </div>
    </>
  );
}
