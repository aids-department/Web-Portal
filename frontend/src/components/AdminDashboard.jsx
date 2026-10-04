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
  UserPlus,
  ArrowUpRight
} from 'lucide-react';
import PageHeader from './ui/PageHeader';
import SpotlightCard from './ui/SpotlightCard';
import { Spinner } from './ui/States';
import { Stagger, StaggerItem } from './ui/Reveal';

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

  const StatCard = ({ icon: Icon, title, value, change }) => (
    <SpotlightCard interactive className="h-full">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="icon-tile h-10 w-10">
            <Icon className="h-[18px] w-[18px] text-accent-bright" strokeWidth={1.75} />
          </div>
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-300">+{change}%</span>
        </div>
        <div>
          <h3 className="text-3xl font-semibold tracking-tight tabular-nums text-fg">{value}</h3>
          <p className="mt-1 text-[13px] text-fg-muted">{title}</p>
        </div>
      </div>
    </SpotlightCard>
  );

  const QuickAction = ({ icon: Icon, title, description, onClick }) => (
    <SpotlightCard as="button" interactive onClick={onClick} className="w-full text-left">
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="icon-tile h-10 w-10">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>
          <ArrowUpRight className="h-4 w-4 text-fg-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
        </div>
        <h3 className="mt-1 font-semibold tracking-tight text-fg">{title}</h3>
        <p className="text-[13px] text-fg-muted">{description}</p>
      </div>
    </SpotlightCard>
  );

  const Panel = ({ icon: Icon, title, meta, children, className = '' }) => (
    <div className={`surface flex flex-col p-5 ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-fg">
          <Icon className="h-4 w-4 text-accent-bright" strokeWidth={1.75} />
          {title}
        </h3>
        <span className="font-mono text-[11px] text-fg-muted">{meta}</span>
      </div>
      {children}
    </div>
  );

  const PanelSpinner = () => (
    <div className="py-8 text-center">
      <Spinner className="mx-auto h-6 w-6" />
    </div>
  );

  const Row = ({ title, sub }) => (
    <div className="rounded-lg border border-line bg-white/[0.02] px-3.5 py-3 transition-colors hover:bg-white/[0.04]">
      <p className="truncate text-[13.5px] font-medium text-fg">{title}</p>
      <p className="mt-0.5 truncate text-[12px] text-fg-muted">{sub}</p>
    </div>
  );

  const Empty = ({ children }) => <p className="py-4 text-center text-[13px] text-fg-muted">{children}</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        compact
        eyebrow="Overview"
        title="Admin Dashboard"
        description="Monitor and manage your web portal analytics"
      />

      {/* Stats Grid */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: Users, title: 'Total Users', value: stats.totalUsers, change: stats.userChange },
          { icon: FileText, title: 'Total Posts', value: stats.totalPosts, change: stats.postChange },
          { icon: Calendar, title: 'Events', value: stats.totalEvents, change: stats.eventChange },
          { icon: Trophy, title: 'Achievements', value: stats.totalAchievements, change: stats.achievementChange },
          { icon: BookOpen, title: 'Question Papers', value: stats.questionPapers, change: stats.qpChange },
        ].map((s) => (
          <StaggerItem key={s.title} className="h-full">
            <StatCard icon={s.icon} title={s.title} value={stats.loading ? '...' : s.value} change={s.change} />
          </StaggerItem>
        ))}
      </Stagger>


      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Post Activity Timeline */}
        <Panel icon={TrendingUp} title="Post Activity Timeline" meta="Last 7 days">
          <div className="relative h-64 overflow-hidden rounded-xl border border-line bg-canvas-elevated/60 p-4">
            {stats.loading ? (
              <div className="flex h-full items-center justify-center">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
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
                  const areaData = `${pathData} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`;

                  return (
                    <>
                      <defs>
                        <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5E6AD2" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#5E6AD2" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={i} x1="40" y1={40 + i * 25} x2="380" y2={40 + i * 25} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      ))}

                      {/* Area + line path */}
                      <path d={areaData} fill="url(#dash-area)" />
                      <path d={pathData} fill="none" stroke="#6872D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Data points */}
                      {points.map((point, index) => (
                        <g key={index}>
                          <circle cx={point.x} cy={point.y} r="3.5" fill="#6872D9" stroke="#0a0a0c" strokeWidth="2" />
                          <text x={point.x} y="185" textAnchor="middle" fontSize="11" fill="#8A8F98">{point.day}</text>
                          <text x={point.x} y={point.y - 9} textAnchor="middle" fontSize="11" fontWeight="500" fill="#EDEDEF">{point.count}</text>
                        </g>
                      ))}
                    </>
                  );
                })()
                }
              </svg>
            )}
          </div>
        </Panel>

        {/* Recent Posts */}
        <Panel icon={FileText} title="Recent Posts" meta={`${stats.totalPosts} total`}>
          <div className="space-y-2">
            {stats.loading ? (
              <PanelSpinner />
            ) : stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post, index) => (
                <Row
                  key={post._id || index}
                  title={post.title}
                  sub={`by ${post.author?.fullName || 'Anonymous'} • ${new Date(post.createdAt).toLocaleDateString()}`}
                />
              ))
            ) : (
              <Empty>No recent posts</Empty>
            )}
          </div>
        </Panel>

        {/* Recent Users */}
        <Panel icon={UserPlus} title="New Users" meta={`${stats.totalUsers} total`}>
          <div className="space-y-2">
            {stats.loading ? (
              <PanelSpinner />
            ) : stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user, index) => (
                <Row
                  key={user._id || index}
                  title={user.fullName || user.name || 'Anonymous'}
                  sub={`${user.year || 'N/A'} Year • ${user.email || 'No email'}`}
                />
              ))
            ) : (
              <Empty>No recent users</Empty>
            )}
          </div>
        </Panel>
      </div>

      {/* Recent Events & Updates */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Updates */}
        <Panel icon={Activity} title="Recent Updates" meta={`${stats.recentUpdates.length} updates`}>
          <div className="space-y-2">
            {stats.loading ? (
              <PanelSpinner />
            ) : stats.recentUpdates.length > 0 ? (
              stats.recentUpdates.map((update, index) => (
                <Row key={update._id || index} title={update.title} sub={new Date(update.createdAt).toLocaleDateString()} />
              ))
            ) : (
              <Empty>No recent updates</Empty>
            )}
          </div>
        </Panel>

        {/* Recent Events */}
        <Panel icon={Calendar} title="Recent Events" meta={`${stats.totalEvents} total`}>
          <div className="space-y-2">
            {stats.loading ? (
              <PanelSpinner />
            ) : stats.recentEvents.length > 0 ? (
              stats.recentEvents.map((event, index) => (
                <Row
                  key={event._id || index}
                  title={event.eventName}
                  sub={`${event.venue} • ${new Date(event.startDate).toLocaleDateString()}`}
                />
              ))
            ) : (
              <Empty>No recent events</Empty>
            )}
          </div>
        </Panel>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold tracking-tight text-fg">
          <Plus className="h-5 w-5 text-accent-bright" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            icon={Calendar}
            title="Create Event"
            description="Add new events to the portal"
            onClick={() => window.location.href = '/adminpage/events'}
          />
          <QuickAction
            icon={Trophy}
            title="Manage Achievements"
            description="Review pending achievements"
            onClick={() => window.location.href = '/adminpage/achievements'}
          />
          <QuickAction
            icon={Users}
            title="User Management"
            description="View and manage users"
            onClick={() => window.location.href = '/adminpage/leaderboard'}
          />
          <QuickAction
            icon={FileText}
            title="Content Updates"
            description="Manage recent updates"
            onClick={() => window.location.href = '/adminpage/manage-content-updates'}
          />
        </div>
      </div>

    </div>
  );
}
