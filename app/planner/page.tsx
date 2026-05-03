"use client";

import { useState } from "react";
import { 
  Plus, MoreHorizontal, Calendar, CheckSquare, GripVertical, 
  Settings, LayoutGrid, LayoutList, Search, Bell, X, Trash2, Palette
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type Priority = "None" | "Low" | "Medium" | "High" | "Critical";

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string;
  date: string;
  subtasks: Subtask[];
  priority: Priority;
  subject: string;
  columnId: string;
};

type Column = {
  id: string;
  title: string;
  colorClass: string;
};

// --- Initial Data ---
const INITIAL_COLUMNS: Column[] = [
  { id: "to-study", title: "To Study", colorClass: "bg-[#F4F5F7]" },
  { id: "in-progress", title: "In Progress", colorClass: "bg-[#F4F5F7]" },
  { id: "needs-review", title: "Needs Review", colorClass: "bg-[#F4F5F7]" },
  { id: "ready", title: "Ready for Exam", colorClass: "bg-[#F4F5F7]" },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Review Calculus Integrals",
    description: "Go over chapter 4 and complete 20 practice problems from the workbook.",
    date: "May 8, 2026",
    subtasks: [
      { id: "s1", title: "Read Chapter 4", completed: false },
      { id: "s2", title: "Do even numbered problems", completed: false },
      { id: "s3", title: "Review mistakes", completed: false },
    ],
    priority: "High",
    subject: "Math",
    columnId: "to-study",
  },
  {
    id: "2",
    title: "Poetry Analysis Essay",
    description: "Analyze the tone and theme of 'The Raven'. Draft the first 3 paragraphs.",
    date: "May 10, 2026",
    subtasks: [
      { id: "s4", title: "Read the poem", completed: true },
      { id: "s5", title: "Draft intro", completed: false },
    ],
    priority: "Medium",
    subject: "English",
    columnId: "in-progress",
  },
];

// --- Helpers ---
const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case "Critical": return "bg-red-50 text-red-600 border border-red-100";
    case "High": return "bg-orange-50 text-orange-600 border border-orange-100";
    case "Medium": return "bg-blue-50 text-blue-600 border border-blue-100";
    case "Low": return "bg-slate-50 text-slate-600 border border-slate-200";
    case "None": return "bg-gray-50 text-gray-400 border border-gray-200 border-dashed";
    default: return "bg-slate-50 text-slate-600";
  }
};

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [activeTab, setActiveTab] = useState("Board");
  
  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  // Inline Add State
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  // Drawer/Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [colorMenuOpenId, setColorMenuOpenId] = useState<string | null>(null);

  const COLUMN_COLORS = [
    { name: "Default", class: "bg-[#F4F5F7]" },
    { name: "Blue", class: "bg-[#EBF3FF]" },
    { name: "Green", class: "bg-[#EFFDF4]" },
    { name: "Yellow", class: "bg-[#FFFCE8]" },
    { name: "Purple", class: "bg-[#F7F2FF]" },
    { name: "Pink", class: "bg-[#FFF0F5]" },
    { name: "Orange", class: "bg-[#FFF5ED]" },
    { name: "Teal", class: "bg-[#ECFCFC]" }
  ];

  const handleUpdateColumnColor = (columnId: string, colorClass: string) => {
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, colorClass } : c));
    setColorMenuOpenId(null);
  };

  // --- Handlers ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("taskId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId } : t));
    }
    setDraggedTaskId(null);
  };

  const handlePriorityChange = (taskId: string, priority: Priority) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, priority } : null);
    }
  };

  const handleAddTask = (columnId: string) => {
    if (!newTaskTitle.trim()) {
      setAddingColumnId(null);
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || "No description provided.",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subtasks: [],
      priority: "None",
      subject: "General",
      columnId,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setAddingColumnId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask(columnId);
    } else if (e.key === 'Escape') {
      setAddingColumnId(null);
      setNewTaskTitle("");
      setNewTaskDesc("");
    }
  };

  // --- Subtask Handlers ---
  const handleAddSubtask = () => {
    if (!selectedTask) return;
    const newSubtask: Subtask = { id: Date.now().toString(), title: "", completed: false };
    
    const updatedTask = { ...selectedTask, subtasks: [...selectedTask.subtasks, newSubtask] };
    setSelectedTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!selectedTask) return;
    const updatedSubtasks = selectedTask.subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };
    setSelectedTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleUpdateSubtaskTitle = (subtaskId: string, newTitle: string) => {
    if (!selectedTask) return;
    const updatedSubtasks = selectedTask.subtasks.map(s => 
      s.id === subtaskId ? { ...s, title: newTitle } : s
    );
    const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };
    setSelectedTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!selectedTask) return;
    const updatedSubtasks = selectedTask.subtasks.filter(s => s.id !== subtaskId);
    const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };
    setSelectedTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFBFC] font-sans overflow-hidden">
      
      {/* --- Top Navigation --- */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-200 shrink-0 z-10 gap-3 sm:gap-0">
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-4">
          <div className="flex bg-gray-100/80 p-1 rounded-lg w-full sm:w-auto justify-center">
            {["Board", "Timeline"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 sm:px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  activeTab === tab 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center w-full sm:w-auto gap-4">
          <div className="relative group w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all w-full sm:w-64"
            />
          </div>
        </div>
      </header>

      {/* --- Board Area --- */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full inline-flex items-start p-4 sm:p-6 gap-4 sm:gap-6">
          {columns.map(col => {
            const columnTasks = tasks.filter(t => t.columnId === col.id);
            
            return (
              <div 
                key={col.id}
                className={`w-[85vw] sm:w-[320px] max-h-full flex flex-col shrink-0 rounded-xl border border-gray-200/60 transition-colors duration-300 ${col.colorClass}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-200/50 shrink-0 relative">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-semibold text-gray-800 text-[15px]">{col.title}</h3>
                    <span className="flex items-center justify-center bg-gray-200/70 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setColorMenuOpenId(colorMenuOpenId === col.id ? null : col.id)}
                      className="p-1.5 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 rounded-md transition"
                    >
                      <Palette size={16} strokeWidth={2.5} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 rounded-md transition">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  {/* Color Picker Popover */}
                  <AnimatePresence>
                    {colorMenuOpenId === col.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 w-[200px]"
                      >
                        <div className="text-xs font-bold text-gray-800 mb-2.5">Column Color</div>
                        <div className="grid grid-cols-4 gap-2">
                          {COLUMN_COLORS.map(color => (
                            <button
                              key={color.name}
                              onClick={() => handleUpdateColumnColor(col.id, color.class)}
                              className={`w-8 h-8 rounded-md border ${color.class} ${col.colorClass === color.class ? 'ring-2 ring-gray-400 ring-offset-1' : 'border-gray-200 hover:scale-110 transition-transform'}`}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Column Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  <AnimatePresence>
                    {columnTasks.map(task => {
                      const completedSubtasks = task.subtasks.filter(s => s.completed).length;
                      const totalSubtasks = task.subtasks.length;
                      
                      return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={task.id}
                        draggable
                        onDragStart={(e: any) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer group hover:shadow-md transition-shadow relative
                          ${draggedTaskId === task.id ? 'opacity-50 border-dashed border-2' : ''}
                        `}
                      >
                        {/* Drag Handle & Options */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <div className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1">
                            <GripVertical size={14} />
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          <select
                            value={task.priority}
                            onChange={(e) => { e.stopPropagation(); handlePriorityChange(task.id, e.target.value as Priority); }}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md appearance-none cursor-pointer outline-none text-center ${getPriorityStyles(task.priority)}`}
                          >
                            <option value="None">No Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                            {task.subject}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <h4 className="font-bold text-gray-900 mb-1.5 text-[15px] leading-tight pr-6">
                          {task.title}
                        </h4>
                        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
                          {task.description}
                        </p>

                        {/* Footer Info */}
                        <div className="flex items-center gap-4 text-[12px] font-medium text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{task.date}</span>
                          </div>
                          {totalSubtasks > 0 && (
                            <div className={`flex items-center gap-1.5 ${completedSubtasks === totalSubtasks ? 'text-emerald-500' : ''}`}>
                              <CheckSquare size={14} />
                              <span>{completedSubtasks}/{totalSubtasks}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )})}
                  </AnimatePresence>

                  {/* Inline Add Task Input */}
                  {addingColumnId === col.id ? (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">Task Title</label>
                        <input 
                          autoFocus
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, col.id)}
                          placeholder="Enter task title"
                          className="w-full text-sm outline-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">Description (optional)</label>
                        <textarea 
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Enter task description"
                          className="w-full text-sm outline-none resize-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <button 
                          onClick={() => handleAddTask(col.id)}
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => { setAddingColumnId(null); setNewTaskTitle(""); setNewTaskDesc(""); }}
                          className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setAddingColumnId(col.id)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 rounded-xl transition"
                    >
                      <Plus size={16} strokeWidth={2.5} /> Add Task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Add Column Button */}
          <button className="w-[85vw] sm:w-[320px] shrink-0 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition font-semibold text-sm">
            <Plus size={16} strokeWidth={2.5} /> Add Column
          </button>
        </div>
      </main>

      {/* --- Side Drawer (Task Details) --- */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-200/50 px-2.5 py-1 rounded-full">
                  {selectedTask.columnId.replace('-', ' ')}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition">
                    <MoreHorizontal size={18} />
                  </button>
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">{selectedTask.title}</h2>
                
                {/* Meta Grid */}
                <div className="grid grid-cols-3 gap-y-6 mb-8 text-sm">
                  <div className="font-semibold text-gray-500">Status</div>
                  <div className="col-span-2">
                    <select className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 font-medium text-gray-700 outline-none hover:border-gray-300 w-fit">
                      {columns.map(c => (
                        <option key={c.id} value={c.id} selected={c.id === selectedTask.columnId}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="font-semibold text-gray-500">Priority</div>
                  <div className="col-span-2">
                    <select
                      value={selectedTask.priority}
                      onChange={(e) => handlePriorityChange(selectedTask.id, e.target.value as Priority)}
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md appearance-none cursor-pointer outline-none text-center hover:ring-2 hover:ring-gray-200 transition-all ${getPriorityStyles(selectedTask.priority)}`}
                    >
                      <option value="None" className="bg-white text-gray-800">No Priority</option>
                      <option value="Low" className="bg-white text-gray-800">Low</option>
                      <option value="Medium" className="bg-white text-gray-800">Medium</option>
                      <option value="High" className="bg-white text-gray-800">High</option>
                      <option value="Critical" className="bg-white text-gray-800">Critical</option>
                    </select>
                  </div>

                  <div className="font-semibold text-gray-500">Due Date</div>
                  <div className="col-span-2 flex items-center gap-2 font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md w-fit hover:border-gray-300 cursor-pointer">
                    <Calendar size={14} className="text-gray-400"/> {selectedTask.date}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><LayoutList size={16} className="text-gray-400"/> Description</h3>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[14px] text-gray-700 leading-relaxed outline-none focus:border-blue-300 focus:bg-white transition-colors"
                    rows={4}
                    defaultValue={selectedTask.description}
                  />
                </div>

                {/* Subtasks Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><CheckSquare size={16} className="text-gray-400"/> Sub-tasks</h3>
                    <span className="text-xs font-semibold text-gray-400">
                      {selectedTask.subtasks.filter(s => s.completed).length}/{selectedTask.subtasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedTask.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition group">
                        <div className="flex items-center gap-3 w-full pr-4">
                          <input 
                            type="checkbox" 
                            checked={subtask.completed}
                            onChange={() => handleToggleSubtask(subtask.id)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer shrink-0" 
                          />
                          <input 
                            type="text"
                            value={subtask.title}
                            onChange={(e) => handleUpdateSubtaskTitle(subtask.id, e.target.value)}
                            className={`text-[14px] font-medium w-full bg-transparent outline-none border-b border-transparent focus:border-blue-300 transition-colors ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                            placeholder="Subtask description..."
                          />
                        </div>
                        <button 
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={handleAddSubtask}
                      className="w-full flex items-center gap-2 px-3 py-2.5 mt-2 text-[14px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition"
                    >
                      <Plus size={16} strokeWidth={2.5}/> Add sub-task
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
