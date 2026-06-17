import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  ChevronDown,
  ListTodo,
  Clock,
  LayoutGrid,
} from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', className: 'badge-low' },
  MEDIUM: { label: 'Medium', className: 'badge-medium' },
  HIGH: { label: 'High', className: 'badge-high' },
};

const STATUS_CONFIG = {
  TODO: { label: 'To Do' },
  IN_PROGRESS: { label: 'In Progress' },
  DONE: { label: 'Done' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'DONE') return false;
  return new Date(dateStr + 'T00:00:00') < new Date();
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title,
      description,
      status: 'TODO',
      priority,
      dueDate: dueDate || null,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const created = await res.json();
      setTasks([created, ...tasks]);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    try {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const toggleDone = (task) => {
    handleStatusChange(task, task.status === 'DONE' ? 'TODO' : 'DONE');
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  };

  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);
  const progressPct = counts.ALL === 0 ? 0 : (counts.DONE / counts.ALL) * 100;

  const TABS = [
    { key: 'ALL', label: 'All', icon: <LayoutGrid size={14} /> },
    { key: 'TODO', label: 'To Do', icon: <Circle size={14} /> },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: <Clock size={14} /> },
    { key: 'DONE', label: 'Done', icon: <CheckCircle2 size={14} /> },
  ];

  if (loading) return <div className="page"><div className="container">Loading tasks...</div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="workspace-row">
            <div className="workspace-icon">
              <ListTodo size={16} />
            </div>
            <span className="workspace-label">Workspace</span>
          </div>
          <h1>My Tasks</h1>
          <p className="subtitle">{counts.DONE} of {counts.ALL} tasks completed</p>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {!showForm ? (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>Add new task</span>
          </button>
        ) : (
          <div className="task-form">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask(e)}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <div className="form-row">
              <div className="select-wrap">
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="LOW">Low priority</option>
                  <option value="MEDIUM">Medium priority</option>
                  <option value="HIGH">High priority</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="submit-btn" onClick={handleAddTask}>Add Task</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="filter-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="tab-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 && (
            <div className="empty">
              <ListTodo size={36} />
              <p>No tasks here</p>
            </div>
          )}
          {filteredTasks.map((task) => {
            const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div key={task.id} className={`task-card ${task.status === 'DONE' ? 'is-done' : ''}`}>
                <button className="check-btn" onClick={() => toggleDone(task)}>
                  {task.status === 'DONE' ? (
                    <CheckCircle2 size={18} className="check-done" />
                  ) : (
                    <Circle size={18} className="check-empty" />
                  )}
                </button>

                <div className="task-body">
                  <div className="task-title-row">
                    <h3 className={task.status === 'DONE' ? 'done-text' : ''}>{task.title}</h3>
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {task.description && (
                    <p className={task.status === 'DONE' ? 'done-text' : ''}>{task.description}</p>
                  )}

                  <div className="task-meta">
                    <span className={`badge ${p.className}`}>
                      <span className="dot" /> {p.label}
                    </span>

                    {task.dueDate && (
                      <span className={`due-date ${overdue ? 'overdue' : ''}`}>
                        <Calendar size={11} />
                        {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
                      </span>
                    )}

                    <div className="select-wrap status-wrap">
                      <select
                        className={`status-select status-${task.status?.toLowerCase()}`}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                      <ChevronDown size={10} className="select-chevron" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;