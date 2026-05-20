import React from 'react';
import { PlusCircle, UploadCloud, HelpCircle, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: 'Create Course',
      desc: 'Start a new course',
      icon: <PlusCircle size={20} />,
      color: 'bg-indigo-600 text-white hover:bg-indigo-700 ring-indigo-200',
      action: () => navigate('/instructor/create')
    },
    {
      title: 'View Analytics',
      desc: 'Detailed reports',
      icon: <BarChart2 size={20} />,
      color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 ring-slate-100',
      action: () => {} // placeholder
    },
    {
      title: 'Upload Materials',
      desc: 'Add resources',
      icon: <UploadCloud size={20} />,
      color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 ring-slate-100',
      action: () => {} // placeholder
    },
    {
      title: 'Support',
      desc: 'Get help',
      icon: <HelpCircle size={20} />,
      color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 ring-slate-100',
      action: () => {} // placeholder
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, idx) => (
          <button 
            key={idx}
            onClick={act.action}
            className={`flex flex-col items-start p-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 ${act.color}`}
          >
            <div className="mb-3">{act.icon}</div>
            <h3 className="font-semibold text-sm mb-0.5 text-left">{act.title}</h3>
            <p className="text-[11px] opacity-80 text-left">{act.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
