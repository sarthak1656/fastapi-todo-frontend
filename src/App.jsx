import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Plus, Loader2 } from 'lucide-react';

// Ensure there is no trailing slash unless your FastAPI route has one
const API_URL = "https://fastapi-todo-backend-746p.onrender.com/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Backend waking up or error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      const res = await axios.post(API_URL, { 
        title: input,
        description: "" // Matching your updated FastAPI schema
      });
      setTodos([...todos, res.data]);
      setInput("");
    } catch (err) {
      alert("Failed to add task. Is the backend live?");
    }
  };

  const toggleComplete = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`);
      setTodos(todos.map(t => t.id === id ? { ...t, is_done: !t.is_done } : t));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex justify-center font-sans">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            FastAPI Vault
          </h1>
          <p className="text-slate-400 text-sm mt-2">Cloud-Synced Tasks</p>
        </header>

        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg transition-transform active:scale-95">
            <Plus size={24} />
          </button>
        </form>

        {loading && (
          <div className="flex justify-center mb-4">
            <Loader2 className="animate-spin text-cyan-500" />
            <span className="ml-2 text-slate-400 text-sm">Waking up Render backend...</span>
          </div>
        )}

        <div className="space-y-3">
          {todos.length === 0 && !loading && (
            <p className="text-center text-slate-500 italic">No tasks yet. Add one above!</p>
          )}
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700 group hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleComplete(todo.id)} className="transition-colors">
                  {todo.is_done ? 
                    <CheckCircle className="text-green-400" /> : 
                    <Circle className="text-slate-500 hover:text-cyan-400" />
                  }
                </button>
                <span className={`${todo.is_done ? 'line-through text-slate-500' : 'text-slate-200'} font-medium`}>
                  {todo.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTodo(todo.id)} 
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;