import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Flag, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Question, User, Answer } from '../types';

interface ReportedContent {
  id: string;
  type: 'question' | 'answer' | 'user';
  content: Question | Answer | User;
  reportReason: string;
  reportedBy: User;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export const Admin = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'reports'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');

  useEffect(() => {
    if (!isAdmin) return;

    // Load data from localStorage
    const savedUsers = localStorage.getItem('qa_users');
    const savedQuestions = localStorage.getItem('qa_questions');
    const savedAnswers = localStorage.getItem('qa_answers');
    const savedReports = localStorage.getItem('qa_reports');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      // Create mock reports
      const mockReports: ReportedContent[] = [
        {
          id: '1',
          type: 'question',
          content: questions[0],
          reportReason: 'Spam content',
          reportedBy: users[1],
          reportedAt: new Date().toISOString(),
          status: 'pending'
        }
      ];
      setReports(mockReports);
      localStorage.setItem('qa_reports', JSON.stringify(mockReports));
    }
  }, [isAdmin, questions, users]);

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const handleUserAction = (userId: string, action: 'ban' | 'unban' | 'promote' | 'demote') => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'ban':
            return { ...user, role: 'guest' as const };
          case 'unban':
            return { ...user, role: 'user' as const };
          case 'promote':
            return { ...user, role: 'admin' as const };
          case 'demote':
            return { ...user, role: 'user' as const };
          default:
            return user;
        }
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem('qa_users', JSON.stringify(updatedUsers));
  };

  const handleContentAction = (contentId: string, contentType: 'question' | 'answer', action: 'approve' | 'remove') => {
    if (contentType === 'question') {
      const updatedQuestions = action === 'remove' 
        ? questions.filter(q => q.id !== contentId)
        : questions;
      setQuestions(updatedQuestions);
      localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
    } else {
      const updatedAnswers = action === 'remove' 
        ? answers.filter(a => a.id !== contentId)
        : answers;
      setAnswers(updatedAnswers);
      localStorage.setItem('qa_answers', JSON.stringify(updatedAnswers));
    }
  };

  const handleReportAction = (reportId: string, action: 'resolve' | 'dismiss') => {
    const updatedReports = reports.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'resolve' ? 'resolved' : 'dismissed' as const }
        : report
    );
    setReports(updatedReports);
    localStorage.setItem('qa_reports', JSON.stringify(updatedReports));
  };

  const stats = {
    totalUsers: users.length,
    totalQuestions: questions.length,
    totalAnswers: answers.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    bannedUsers: users.filter(u => u.role === 'guest').length,
    adminUsers: users.filter(u => u.role === 'admin').length
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      (report.reportReason.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <MessageSquare className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuestions}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Questions</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <CheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAnswers}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Answers</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Flag className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReports}</p>
              <p className="text-gray-600 dark:text-gray-400">Pending Reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <AlertTriangle className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bannedUsers}</p>
              <p className="text-gray-600 dark:text-gray-400">Banned Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Shield className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.adminUsers}</p>
              <p className="text-gray-600 dark:text-gray-400">Admin Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {questions.slice(0, 5).map((question) => (
            <div key={question.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <MessageSquare className="text-blue-500" size={20} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{question.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {question.author.username} • {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                  <CheckCircle size={16} />
                </button>
                <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reputation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      : user.role === 'user'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.reputation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {user.role === 'user' && (
                      <>
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Ban
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'promote')}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          Promote
                        </button>
                      </>
                    )}
                    {user.role === 'guest' && (
                      <button
                        onClick={() => handleUserAction(user.id, 'unban')}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Unban
                      </button>
                    )}
                    {user.role === 'admin' && user.id !== '1' && (
                      <button
                        onClick={() => handleUserAction(user.id, 'demote')}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        Demote
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'resolved')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : report.status === 'resolved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {report.reportReason}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Reported by {report.reportedBy.username} on {new Date(report.reportedAt).toLocaleDateString()}
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {report.type === 'question' 
                      ? (report.content as Question).title
                      : report.type === 'answer'
                      ? 'Answer content...'
                      : (report.content as User).username
                    }
                  </p>
                </div>
              </div>
              
              {report.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleReportAction(report.id, 'resolve')}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <CheckCircle size={14} />
                    <span>Resolve</span>
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'dismiss')}
                    className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <XCircle size={14} />
                    <span>Dismiss</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'All reports have been handled.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'reports', name: 'Reports', icon: Flag },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, content, and reports
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Shield size={16} />
          <span>Administrator</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
};