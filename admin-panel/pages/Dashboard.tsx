
import {
  ArrowUpRight,
  Briefcase,
  MessageCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../types';

interface DashboardProps {
  data: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [analytics, setAnalytics] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { getAnalytics } = await import('../api');
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { label: 'Total Visits', value: analytics?.totalVisits || 0, icon: <TrendingUp />, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Unique Visitors', value: analytics?.uniqueVisitors || 0, icon: <Users />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Total Projects', value: data.projects.length, icon: <Briefcase />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pending Queries', value: data.queries.filter(q => q.status === 'unread').length, icon: <MessageCircle />, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {data.hero.name.split(' ')[0]}!</h1>
        <p className="text-gray-400 mt-2">Here is what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0a0a1a] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0a1a] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-bold text-lg">Recent Queries</h2>
            <Link to="/queries">
              <button className="text-xs text-cyan-400 font-bold uppercase tracking-wider">View All</button>
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {data.queries.length > 0 ? (
              data.queries.slice(0, 5).map(query => (
                <div key={query._id} className="p-6 hover:bg-gray-800/30 transition-colors flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold">
                    {query.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white">{query.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{query.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-500 italic">No inquiries yet.</div>
            )}
          </div>
        </div>

        <div className="bg-[#0a0a1a] rounded-2xl border border-gray-800 p-6">
          <h2 className="font-bold text-lg mb-6">Quick Profile</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={data.hero.profileImage.startsWith('http') ? data.hero.profileImage : import.meta.env.VITE_API_URL + data.hero.profileImage} className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/20" alt="" />
              <div>
                <h4 className="font-bold text-white">{data.hero.name}</h4>
                <p className="text-sm text-gray-500">{data.hero.role}</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              {data.stats.map(stat => (
                <div key={stat._id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-xl">
                  <span className="text-sm text-gray-400">{stat.label}</span>
                  <span className="text-sm font-bold text-cyan-400">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
