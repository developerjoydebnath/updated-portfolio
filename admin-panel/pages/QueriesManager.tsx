import { CheckCircle, Clock, Mail, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { deleteQuery, updateQuery } from '../api';
import { AppState, ClientQuery } from '../types';

interface QueriesManagerProps {
  data: AppState;
  onUpdate: (newData: Partial<AppState>) => void;
}

const QueriesManager: React.FC<QueriesManagerProps> = ({ data, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<ClientQuery | null>(null);

  const filteredQueries = data.queries.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = async (id: string, status: ClientQuery['status']) => {
    try {
      await updateQuery(id, { status });
      onUpdate({
        queries: data.queries.map(q => q._id === id ? { ...q, status } : q)
      });
    } catch (error) {
      console.error('Failed to update query status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await deleteQuery(id);
        onUpdate({ queries: data.queries.filter(q => q._id !== id) });
        if (selectedQuery?._id === id) setSelectedQuery(null);
      } catch (error) {
        console.error('Failed to delete query:', error);
        alert('Failed to delete query');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Queries</h1>
          <p className="text-gray-400">Manage incoming messages from your portfolio contact form.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-2.5 focus:border-cyan-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden sm:flex gap-6 pb-6">
        <div className="sm:w-1/3 sm:mb-0 mb-4 bg-[#0a0a1a] rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-900/30 font-semibold text-sm text-gray-400">
            {filteredQueries.length} Messages
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-800">
            {filteredQueries.map(query => (
              <div 
                key={query._id}
                onClick={() => {
                  setSelectedQuery(query);
                  if (query.status === 'unread') handleStatusChange(query._id, 'read');
                }}
                className={`p-4 cursor-pointer transition-all hover:bg-gray-800/20 relative ${
                  selectedQuery?._id === query._id ? 'bg-cyan-500/5 border-l-4 border-cyan-500' : ''
                }`}
              >
                {query.status === 'unread' && <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-white truncate pr-6">{query.name}</h4>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(query.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-medium truncate mb-1">{query.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{query.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-[#0a0a1a] py-4 rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
          {selectedQuery ? (
            <>
              <div className="p-6 border-b border-gray-800 bg-gray-900/30 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-cyan-400">
                    {selectedQuery.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedQuery.name}</h3>
                    <p className="text-xs text-gray-500">{selectedQuery.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(selectedQuery._id, 'replied')}
                    className="p-2.5 bg-gray-800 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-xl transition-all"
                    title="Mark as Replied"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedQuery._id)}
                    className="p-2.5 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Subject</span>
                  <h2 className="text-xl font-bold text-white">{selectedQuery.subject}</h2>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Message</span>
                  <p className="text-gray-300 leading-relaxed bg-gray-900/50 p-6 rounded-2xl border border-gray-800 whitespace-pre-wrap">
                    {selectedQuery.message}
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-800 bg-gray-900/30">
                <a 
                  href={`mailto:${selectedQuery.email}?subject=Re: ${selectedQuery.subject}`}
                  className="w-full flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Mail size={18} />
                  Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
                <Mail size={40} className="opacity-20" />
              </div>
              <p className="text-lg font-medium">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesManager;
