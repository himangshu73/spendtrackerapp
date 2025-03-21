"use client";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { FormEvent, useState, useEffect } from "react";

interface Task {
  _id: string;
  task: string;
  createdAt: Date;
}

export default function Task() {
  const { data: session, status } = useSession();
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.trim()) {
      alert("Task cannot be empty");
      return;
    }

    try {
      if (editTaskId) {
        const response = await axios.put("/api/updatetask", {
          id: editTaskId,
          task: task.trim(),
        });
        setTasks(
          tasks.map((t) => (t._id === editTaskId ? response.data.task : t))
        );
        setEditTaskId(null);
      } else {
        const response = await axios.post("/api/addtask", { task: task });
        setTasks([...tasks, response.data.task]);
      }
      setTask("");
    } catch (error) {
      console.log("Error submitting task,", error);
      alert("Error submit task");
    }
  };

  const handleEdit = (id: string, currentTask: string) => {
    setEditTaskId(id);
    setTask(currentTask);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/deletetask", { data: { id } });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/showtask");
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchTasks();
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!session) {
    return (
      <div>
        <p>You need to log in to manage tasks.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Sign In
        </button>
      </div>
    );
  }
  return (
    <>
      <div className="mt-4 p-4">
        <h1>{editTaskId ? "Edit Task" : "Add Task"}</h1>
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
            {editTaskId ? "Update" : "Submit"}
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
                  <button
                    onClick={() => {
                      handleEdit(task._id, task.task);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white font-bold rounded-sm px-2 py-1"
                  >
                    Delete
                  </button>
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
