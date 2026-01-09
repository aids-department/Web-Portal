import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  FileText, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Activity,
  Eye,
  Download,
  Plus,
  BarChart3,
  BookOpen,
  Clock,
  UserPlus
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalAchievements: 0,
    pendingAchievements: 0,
    recentUpdates: [],
    recentPosts: [],
    recentUsers: [],
    recentEvents: [],
    questionPapers: 0,
    userChange: 0,
    postChange: 0,
    eventChange: 0,
    achievementChange: 0,
    qpChange: 0,
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, postsRes, eventsRes, achievementsRes, updatesRes, qpRes] = await Promise.all([
        fetch('https://web-portal-760h.onrender.com/api/profile'),
        fetch('https://web-portal-760h.onrender.com/api/posts'),
        fetch('https://web-portal-760h.onrender.com/api/events'),
        fetch('https://web-portal-760h.onrender.com/api/achievements/approved/recent'),
        fetch('https://web-portal-760h.onrender.com/api/updates'),
        fetch('https://web-portal-760h.onrender.com/api/qp')
      ]);

      const [users, posts, events, achievements, updates, questionPapers] = await Promise.all([
        usersRes.json(),
        postsRes.json(),
        eventsRes.json(),
        achievementsRes.json(),
        updatesRes.json(),
        qpRes.json()
      ]);

      // Fetch pending achievements
      const pendingRes = await fetch('https://web-portal-760h.onrender.com/api/achievements/pending');
      const pending = await pendingRes.json();

      // Sort users by creation date (newest first)
      const sortedUsers = Array.isArray(users) ? users.sort((a, b) => new Date(b.createdAt || b.dateJoined || 0) - new Date(a.createdAt || a.dateJoined || 0)) : [];

      // Calculate percentage changes based on yesterday's data
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const todayUsers = users.filter(u => new Date(u.createdAt || u.dateJoined).toDateString() === today.toDateString()).length;
      const yesterdayUsers = users.filter(u => new Date(u.createdAt || u.dateJoined).toDateString() === yesterday.toDateString()).length;
      const userChange = yesterdayUsers > 0 ? Math.round(((todayUsers - yesterdayUsers) / yesterdayUsers) * 100) : todayUsers > 0 ? 100 : 0;

      const todayPosts = posts.filter(p => new Date(p.createdAt).toDateString() === today.toDateString()).length;
      const yesterdayPosts = posts.filter(p => new Date(p.createdAt).toDateString() === yesterday.toDateString()).length;
      const postChange = yesterdayPosts > 0 ? Math.round(((todayPosts - yesterdayPosts) / yesterdayPosts) * 100) : todayPosts > 0 ? 100 : 0;

      const todayEvents = events.filter(e => new Date(e.createdAt).toDateString() === today.toDateString()).length;
      const yesterdayEvents = events.filter(e => new Date(e.createdAt).toDateString() === yesterday.toDateString()).length;
      const eventChange = yesterdayEvents > 0 ? Math.round(((todayEvents - yesterdayEvents) / yesterdayEvents) * 100) : todayEvents > 0 ? 100 : 0;

      const todayAchievements = achievements.filter(a => new Date(a.createdAt).toDateString() === today.toDateString()).length;
      const yesterdayAchievements = achievements.filter(a => new Date(a.createdAt).toDateString() === yesterday.toDateString()).length;
      const achievementChange = yesterdayAchievements > 0 ? Math.round(((todayAchievements - yesterdayAchievements) / yesterdayAchievements) * 100) : todayAchievements > 0 ? 100 : 0;

      const todayQP = questionPapers.filter(q => new Date(q.createdAt).toDateString() === today.toDateString()).length;
      const yesterdayQP = questionPapers.filter(q => new Date(q.createdAt).toDateString() === yesterday.toDateString()).length;
      const qpChange = yesterdayQP > 0 ? Math.round(((todayQP - yesterdayQP) / yesterdayQP) * 100) : todayQP > 0 ? 100 : 0;

      setStats({
        totalUsers: users.length || 0,
        totalPosts: posts.length || 0,
        totalEvents: events.length || 0,
        totalAchievements: achievements.length || 0,
        pendingAchievements: pending.length || 0,
        recentUpdates: updates.slice(0, 4) || [],
        recentPosts: posts.slice(0, 5) || [],
        recentUsers: sortedUsers.slice(0, 5) || [],
        recentEvents: events.slice(0, 3) || [],
        questionPapers: questionPapers.length || 0,
        userChange: Math.abs(userChange),
        postChange: Math.abs(postChange),
        eventChange: Math.abs(eventChange),
        achievementChange: Math.abs(achievementChange),
        qpChange: Math.abs(qpChange),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">+{change}%</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, color, onClick }) => (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color} mb-4 w-fit`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600">
          Monitor and manage your web portal analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Users" 
          value={stats.loading ? '...' : stats.totalUsers} 
          change={stats.userChange} 
          color="from-blue-500 to-blue-600"
        />
        <StatCard 
          icon={FileText} 
          title="Total Posts" 
          value={stats.loading ? '...' : stats.totalPosts} 
          change={stats.postChange} 
          color="from-green-500 to-green-600"
        />
        <StatCard 
          icon={Calendar} 
          title="Events" 
          value={stats.loading ? '...' : stats.totalEvents} 
          change={stats.eventChange} 
          color="from-purple-500 to-purple-600"
        />
        <StatCard 
          icon={Trophy} 
          title="Achievements" 
          value={stats.loading ? '...' : stats.totalAchievements} 
          change={stats.achievementChange} 
          color="from-orange-500 to-orange-600"
        />
        <StatCard 
          icon={BookOpen} 
          title="Question Papers" 
          value={stats.loading ? '...' : stats.questionPapers} 
          change={stats.qpChange} 
          color="from-indigo-500 to-indigo-600"
        />
      </div>


      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post Activity Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Post Activity Timeline
            </h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="h-64 relative bg-gray-50 rounded-lg p-4 overflow-hidden">
            {stats.loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                {(() => {
                  const last7Days = Array.from({length: 7}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const dayPosts = stats.recentPosts.filter(post => {
                      const postDate = new Date(post.createdAt);
                      return postDate.toDateString() === date.toDateString();
                    }).length;
                    return { date, count: dayPosts, day: date.toLocaleDateString('en', { weekday: 'short' }) };
                  });
                  const maxCount = Math.max(...last7Days.map(d => d.count), 1);
                  
                  const points = last7Days.map((day, index) => {
                    const x = (index * 50) + 50;
                    const y = 160 - ((day.count / maxCount) * 100);
                    return { x, y, count: day.count, day: day.day };
                  });
                  
                  const pathData = points.map((point, index) => 
                    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                  ).join(' ');
                  
                  return (
                    <>
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={i} x1="40" y1={40 + i * 25} x2="380" y2={40 + i * 25} stroke="#e5e7eb" strokeWidth="1" />
                      ))}
                      
                      {/* Line path */}
                      <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Data points */}
                      {points.map((point, index) => (
                        <g key={index}>
                          <circle cx={point.x} cy={point.y} r="3" fill="#3b82f6" stroke="white" strokeWidth="2" />
                          <text x={point.x} y="185" textAnchor="middle" className="text-xs fill-gray-600">{point.day}</text>
                          <text x={point.x} y={point.y - 8} textAnchor="middle" className="text-xs fill-gray-700 font-medium">{point.count}</text>
                        </g>
                      ))}
                    </>
                  );
                })()
                }
              </svg>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Recent Posts
            </h3>
            <span className="text-sm text-gray-500">{stats.totalPosts} total</span>
          </div>
          <div className="space-y-3">
            {stats.loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post, index) => (
                <div key={post._id || index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-600">
                    by {post.author?.fullName || 'Anonymous'} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent posts</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              New Users
            </h3>
            <span className="text-sm text-gray-500">{stats.totalUsers} total</span>
          </div>
          <div className="space-y-3">
            {stats.loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user, index) => (
                <div key={user._id || index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{user.fullName || user.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-600">
                    {user.year || 'N/A'} Year • {user.email || 'No email'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Recent Updates
            </h3>
            <span className="text-sm text-gray-500">{stats.recentUpdates.length} updates</span>
          </div>
          <div className="space-y-3">
            {stats.loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : stats.recentUpdates.length > 0 ? (
              stats.recentUpdates.map((update, index) => (
                <div key={update._id || index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{update.title}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(update.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent updates</p>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Recent Events
            </h3>
            <span className="text-sm text-gray-500">{stats.totalEvents} total</span>
          </div>
          <div className="space-y-3">
            {stats.loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
              </div>
            ) : stats.recentEvents.length > 0 ? (
              stats.recentEvents.map((event, index) => (
                <div key={event._id || index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{event.eventName}</p>
                  <p className="text-xs text-gray-600">
                    {event.venue} • {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent events</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plus className="w-6 h-6 text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction 
            icon={Calendar}
            title="Create Event"
            description="Add new events to the portal"
            color="from-blue-500 to-blue-600"
            onClick={() => window.location.href = '/adminpage/events'}
          />
          <QuickAction 
            icon={Trophy}
            title="Manage Achievements"
            description="Review pending achievements"
            color="from-green-500 to-green-600"
            onClick={() => window.location.href = '/adminpage/achievements'}
          />
          <QuickAction 
            icon={Users}
            title="User Management"
            description="View and manage users"
            color="from-purple-500 to-purple-600"
            onClick={() => window.location.href = '/adminpage/leaderboard'}
          />
          <QuickAction 
            icon={FileText}
            title="Content Updates"
            description="Manage recent updates"
            color="from-orange-500 to-orange-600"
            onClick={() => window.location.href = '/adminpage/manage-content-updates'}
          />
        </div>
      </div>

    </div>
  );
}