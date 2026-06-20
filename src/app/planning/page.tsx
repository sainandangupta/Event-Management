'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ListTodo,
  Kanban,
  CalendarDays,
  Activity,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useTasks, useCreateTask, useUpdateTask } from '../../modules/event-management/hooks/queries';
import { TaskStatus, TaskPriority } from '../../modules/event-management/types';

// Zod schema for new task
const taskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['High', 'Medium', 'Low']),
  isMilestone: z.boolean()
});

type TaskFormValues = z.infer<typeof schema>;

const schema = taskSchema;

function PlanningPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'tasks';

  const { currentEventId, events } = useEventManagementStore();
  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];

  const { data: tasks = [], isLoading: tasksLoading } = useTasks(currentEventId || undefined);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  // Task creation state
  const [addingTask, setAddingTask] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      assignee: 'Alexander West',
      dueDate: '',
      priority: 'Medium',
      isMilestone: false
    }
  });

  const onSubmitTask = async (data: TaskFormValues) => {
    if (!currentEventId) return;
    try {
      await createTaskMutation.mutateAsync({
        eventId: currentEventId,
        title: data.title,
        assignee: data.assignee,
        dueDate: data.dueDate,
        priority: data.priority as TaskPriority,
        isMilestone: data.isMilestone,
        status: 'Todo',
        dependencies: [],
        progress: 0
      });
      alert('Task added successfully!');
      reset();
      setAddingTask(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle status helper
  const handleToggleTaskCheck = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'Done' ? 'Todo' : 'Done';
    await updateTaskMutation.mutateAsync({
      id: taskId,
      updates: { status: nextStatus, progress: nextStatus === 'Done' ? 100 : 0 }
    });
  };

  // Move task status in Kanban helper
  const handleMoveStatus = async (taskId: string, targetStatus: TaskStatus) => {
    let nextProgress = 0;
    if (targetStatus === 'In Progress') nextProgress = 25;
    else if (targetStatus === 'In Review') nextProgress = 85;
    else if (targetStatus === 'Done') nextProgress = 100;

    await updateTaskMutation.mutateAsync({
      id: taskId,
      updates: { status: targetStatus, progress: nextProgress }
    });
  };

  // Statistics calculation
  const stats = useMemo(() => {
    const eventTasks = tasks;
    const completed = eventTasks.filter((t) => t.status === 'Done').length;
    const total = eventTasks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const milestones = eventTasks.filter((t) => t.isMilestone).length;
    const high = eventTasks.filter((t) => t.priority === 'High' && t.status !== 'Done').length;

    return { completed, total, pct, milestones, high };
  }, [tasks]);

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-primary font-bold text-label-sm uppercase tracking-wider block mb-1">
            {currentEvent?.name || 'All Events'}
          </span>
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Event Planning</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Map out tasks, set milestones, track timelines, and progress stages.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Sub Views Selector Tabs */}
          <button
            onClick={() => router.push('/planning?view=tasks')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'tasks' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <ListTodo size={16} />
            <span>Tasks List</span>
          </button>
          <button
            onClick={() => router.push('/planning?view=kanban')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'kanban' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Kanban size={16} />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => router.push('/planning?view=gantt')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'gantt' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Activity size={16} />
            <span>Gantt Chart</span>
          </button>
          <button
            onClick={() => router.push('/planning?view=calendar')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'calendar' ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <CalendarDays size={16} />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Task Completion
          </p>
          <div className="flex justify-between items-center mt-1">
            <h3 className="font-hanken text-headline-md font-bold text-on-surface">
              {stats.completed} / {stats.total}
            </h3>
            <span className="text-emerald-green font-bold text-label-sm">{stats.pct}%</span>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3">
            <div className="bg-emerald-green h-full rounded-full" style={{ width: `${stats.pct}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Milestones Hit
          </p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface mt-1">
            {stats.milestones} Registered
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-2 font-medium">For this layout template</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Lagging Tasks
          </p>
          <h3 className="font-hanken text-headline-md font-bold text-error mt-1">
            {stats.high} High Priority
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-2 font-medium">Pending immediate review</p>
        </div>
      </div>

      {/* ==============================================================
          VIEW 1: TASKS LIST
          ============================================================== */}
      {view === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-card shadow-sm border border-border-gray overflow-hidden">
            <div className="p-6 border-b border-border-gray flex justify-between items-center">
              <h4 className="font-hanken text-headline-md font-bold text-on-surface">Roadmap Checklist</h4>
              <button
                onClick={() => setAddingTask(true)}
                className="px-4 py-2 bg-primary text-white font-sans text-label-md rounded-xl hover:bg-opacity-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={16} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="px-8 py-4 w-12"></th>
                    <th className="px-6 py-4">Task Details</th>
                    <th className="px-6 py-4">Assignee</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Milestone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-gray text-body-md">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-8 py-5 text-center">
                          <input
                            type="checkbox"
                            checked={task.status === 'Done'}
                            onChange={() => handleToggleTaskCheck(task.id, task.status)}
                            className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-5">
                          <p className={`font-semibold text-on-surface ${task.status === 'Done' ? 'line-through opacity-50' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{task.status}</span>
                            <span className="text-[10px] font-semibold text-on-surface-variant">• Progress: {task.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-semibold text-on-surface-variant">
                          {task.assignee}
                        </td>
                        <td className="px-6 py-5 text-body-sm text-on-surface font-medium">
                          {task.dueDate}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === 'High'
                              ? 'bg-error-container text-error'
                              : task.priority === 'Medium'
                              ? 'bg-secondary-container text-secondary'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {task.isMilestone ? (
                            <span className="text-emerald-green font-bold text-xs flex items-center gap-1">
                              <Check size={14} /> Yes
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/45 font-bold text-xs">No</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-on-surface-variant font-medium">
                        No tasks registered for this event yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 2: KANBAN BOARD
          ============================================================== */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(['Todo', 'In Progress', 'In Review', 'Done'] as TaskStatus[]).map((colStatus) => {
            const colTasks = tasks.filter((t) => t.status === colStatus);
            return (
              <div key={colStatus} className="bg-surface-container-low p-4 rounded-card border border-border-gray flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h5 className="font-hanken font-bold text-on-surface text-base">{colStatus}</h5>
                  <span className="text-xs bg-surface-container-high px-2.5 py-0.5 rounded-full text-on-surface-variant font-bold">
                    {colTasks.length}
                  </span>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                  {colTasks.map((task) => (
                    <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-border-gray group relative">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          task.priority === 'High' ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {task.priority}
                        </span>
                        {task.isMilestone && <span className="text-[9px] text-emerald-green font-bold uppercase tracking-wide">Milestone</span>}
                      </div>
                      <p className="font-semibold text-on-surface text-body-sm mb-4 leading-tight">{task.title}</p>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-border-gray/50 text-[10px]">
                        <span className="text-on-surface-variant font-medium flex items-center gap-1">
                          <User size={12} className="text-primary" />
                          <span>{task.assignee}</span>
                        </span>
                        <span className="text-[9px] font-semibold text-on-surface-variant bg-background-alt px-1.5 py-0.5 rounded">
                          {task.dueDate}
                        </span>
                      </div>

                      {/* Manual Move arrows for simulated Drag & Drop click fallback */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {colStatus !== 'Todo' && (
                          <button
                            onClick={() => {
                              const stages: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];
                              const idx = stages.indexOf(colStatus);
                              handleMoveStatus(task.id, stages[idx - 1]);
                            }}
                            className="p-1 bg-white hover:bg-primary-container/20 text-on-surface hover:text-primary rounded border border-border-gray shadow-sm cursor-pointer"
                            title="Move Back"
                          >
                            <ArrowLeft size={10} />
                          </button>
                        )}
                        {colStatus !== 'Done' && (
                          <button
                            onClick={() => {
                              const stages: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];
                              const idx = stages.indexOf(colStatus);
                              handleMoveStatus(task.id, stages[idx + 1]);
                            }}
                            className="p-1 bg-white hover:bg-primary-container/20 text-on-surface hover:text-primary rounded border border-border-gray shadow-sm cursor-pointer"
                            title="Move Forward"
                          >
                            <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center py-12 text-xs text-on-surface-variant/40 italic font-medium">
                      No tasks in {colStatus}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==============================================================
          VIEW 3: GANTT CHART
          ============================================================== */}
      {view === 'gantt' && (
        <div className="bg-white rounded-card shadow-sm border border-border-gray p-6">
          <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-6">Timeline Roadmap Grid</h4>
          
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[700px] space-y-4">
              {/* Gantt Header Weeks grid */}
              <div className="grid grid-cols-12 gap-2 border-b border-border-gray pb-3 text-center text-label-sm text-on-surface-variant font-bold">
                <div className="col-span-4 text-left px-2">Task / Milestone</div>
                <div className="col-span-2">Week 1</div>
                <div className="col-span-2">Week 2</div>
                <div className="col-span-2">Week 3</div>
                <div className="col-span-2">Week 4</div>
              </div>

              {/* Gantt Rows */}
              {tasks.length > 0 ? (
                tasks.map((task, index) => {
                  // Mock position weights based on index
                  const colStart = (index % 4) + 5; // offset start week columns
                  const colSpan = (index % 3) + 2; // span weeks
                  
                  return (
                    <div key={task.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border-gray/30">
                      <div className="col-span-4 px-2">
                        <p className="font-semibold text-on-surface text-body-sm truncate">{task.title}</p>
                        <span className="text-[9px] font-bold text-on-surface-variant/60">{task.assignee}</span>
                      </div>
                      
                      {/* Bar Container */}
                      <div className="col-span-8 grid grid-cols-8 h-6 relative">
                        <div
                          className="h-full rounded-full flex items-center justify-between px-3 text-[9px] font-bold text-white shadow-sm relative overflow-hidden"
                          style={{
                            gridColumnStart: colStart - 4,
                            gridColumnEnd: Math.min(colStart - 4 + colSpan, 9),
                            background: task.status === 'Done'
                              ? 'linear-gradient(135deg, #4CAF8D 0%, #45a049 100%)'
                              : 'linear-gradient(135deg, #ae2f34 0%, #FF8A5B 100%)',
                          }}
                        >
                          <span className="truncate">{task.progress}%</span>
                          <span className="opacity-80 font-normal">{task.dueDate.split('-')[2]}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-on-surface-variant">No timeline data available.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 4: CALENDAR GRID
          ============================================================== */}
      {view === 'calendar' && (
        <div className="bg-white rounded-card shadow-sm border border-border-gray p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">June 2026</h4>
            <span className="text-xs bg-background-alt border border-border-gray px-3 py-1.5 rounded-full font-bold text-on-surface-variant">
              Month View
            </span>
          </div>

          <div className="grid grid-cols-7 gap-px bg-border-gray text-center rounded-xl overflow-hidden shadow-sm border border-border-gray">
            {/* Days of week */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="bg-surface-container-low py-3 font-sans text-label-sm text-on-surface-variant font-bold">
                {day}
              </div>
            ))}
            
            {/* 35 grid spaces (representing mock June calendar days) */}
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayNumber = idx - 1; // start off logic
              const isValidDay = dayNumber > 0 && dayNumber <= 30;
              
              // Filter tasks matching this dayNumber (mock date mapping matching dayNumber)
              const dayTasks = tasks.filter((t) => {
                if (!isValidDay) return false;
                const taskDayStr = t.dueDate.split('-')[2];
                return parseInt(taskDayStr) === dayNumber;
              });

              return (
                <div key={idx} className="bg-white min-h-[90px] p-2 text-left flex flex-col justify-between border-t border-r border-border-gray/30">
                  <span className={`text-xs font-bold ${isValidDay ? 'text-on-surface' : 'text-on-surface-variant/20'}`}>
                    {isValidDay ? dayNumber : ''}
                  </span>
                  
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                    {isValidDay && dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`text-[9px] font-bold p-1 rounded truncate cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                          t.status === 'Done'
                            ? 'bg-emerald-green/10 text-emerald-green border-l-2 border-emerald-green'
                            : 'bg-primary/10 text-primary border-l-2 border-primary'
                        }`}
                        title={t.title}
                        onClick={() => router.push(`/planning?view=tasks`)}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {addingTask && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="glass-panel w-full max-w-md p-8 rounded-[32px] border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-hanken text-headline-md font-bold text-on-surface">Add New Task</h3>
              <button
                onClick={() => setAddingTask(false)}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitTask)} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase">Task Title</label>
                <input
                  {...register('title')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 font-sans text-body-sm focus:bg-white transition-all"
                  placeholder="e.g. Schedule visual presentation rehearsal"
                  type="text"
                />
                {errors.title && <p className="text-xs text-error font-medium">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-label-sm font-bold text-on-surface-variant uppercase">Assignee</label>
                  <select
                    {...register('assignee')}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 font-sans text-body-sm focus:bg-white transition-all cursor-pointer font-medium"
                  >
                    <option value="Alexander West">Alexander West</option>
                    <option value="Julianne Moore">Julianne Moore</option>
                    <option value="David Chen">David Chen</option>
                    <option value="Elena Rodriguez">Elena Rodriguez</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-sm font-bold text-on-surface-variant uppercase">Due Date</label>
                  <input
                    {...register('dueDate')}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 font-sans text-body-sm focus:bg-white transition-all cursor-pointer font-medium"
                    type="date"
                  />
                  {errors.dueDate && <p className="text-xs text-error font-medium">{errors.dueDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-label-sm font-bold text-on-surface-variant uppercase">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 font-sans text-body-sm focus:bg-white transition-all cursor-pointer font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-body-sm text-on-surface font-semibold">
                    <input
                      type="checkbox"
                      {...register('isMilestone')}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Milestone?</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setAddingTask(false)}
                  className="px-6 py-2 text-on-surface-variant hover:text-primary font-bold cursor-pointer text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer text-label-md shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanningPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    }>
      <PlanningPageContent />
    </Suspense>
  );
}
