import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Plus } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Fetch Todos (Effect Hook)
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input) return;
    const res = await axios.post(API_URL, { title: input });
    setTodos([...todos, res.data]);
    setInput("");
  };

  const toggleComplete = async (id) => {
    await axios.put(`${API_URL}/${id}`);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          FastAPI Vault
        </h1>

        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg transition-colors">
            <Plus size={24} />
          </button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 group hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleComplete(todo.id)} className="text-slate-400 hover:text-cyan-400">
                  {todo.is_done ? <CheckCircle className="text-green-400" /> : <Circle />}
                </button>
                <span className={`${todo.is_done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {todo.title}
                </span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
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