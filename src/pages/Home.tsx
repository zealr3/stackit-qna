import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Eye, 
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Award,
  Zap,
  Users,
  Target,
  Sparkles,
  Filter,
  SortAsc,
  Flame,
  BookOpen,
  Code2
} from 'lucide-react';
import { Question, Tag } from '../types';
import { useAuth } from '../hooks/useAuth';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filter, setFilter] = useState<'newest' | 'trending' | 'unanswered' | 'hot'>('newest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('qa_questions');
    const savedTags = localStorage.getItem('qa_tags');
    
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  const handleVote = (questionId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) return;

    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const currentVote = q.userVote;
        let newVotes = q.votes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote
        if (currentVote === 'up') newVotes--;
        if (currentVote === 'down') newVotes++;

        // Apply new vote
        if (voteType === 'up') {
          newVotes++;
          if (currentVote === 'up') {
            newVotes--;
            newUserVote = null;
          }
        } else {
          newVotes--;
          if (currentVote === 'down') {
            newVotes++;
            newUserVote = null;
          }
        }

        return { ...q, votes: newVotes, userVote: newUserVote };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
  };

  const filteredQuestions = questions
    .filter(q => selectedTag ? q.tags.some(tag => tag.id === selectedTag) : true)
    .sort((a, b) => {
      switch (filter) {
        case 'trending':
          return (b.votes + b.views) - (a.votes + a.views);
        case 'unanswered':
          return a.answerCount === 0 ? -1 : 1;
        case 'hot':
          const aScore = a.votes * 2 + a.views * 0.1 + a.answerCount * 3;
          const bScore = b.votes * 2 + b.views * 0.1 + b.answerCount * 3;
          return bScore - aScore;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const popularTags = tags.slice(0, 8);

  const filterOptions = [
    { id: 'newest', name: 'Newest', icon: Clock, color: 'from-blue-500 to-cyan-500' },
    { id: 'hot', name: 'Hot', icon: Flame, color: 'from-red-500 to-orange-500' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { id: 'unanswered', name: 'Unanswered', icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Banner */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome to DevQ&A</h1>
                <p className="text-blue-100 text-lg">Where developers solve problems together</p>
              </div>
            </div>
            
            <p className="text-blue-100 mb-6 text-lg leading-relaxed max-w-2xl">
              Join our thriving community of developers. Ask questions, share knowledge, and help others grow. 
              Get expert answers to your coding challenges and contribute to the developer ecosystem.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Users size={20} />
                <span>Join the Community</span>
              </Link>
              <Link
                to="/ask"
                className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Target size={20} />
                <span>Ask Your First Question</span>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-blue-200 text-sm">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25K+</div>
                <div className="text-blue-200 text-sm">Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-blue-200 text-sm">Developers</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Questions', 
            value: questions.length, 
            icon: MessageCircle, 
            gradient: 'from-blue-500 to-cyan-500',
            change: '+12%',
            changeType: 'positive'
          },
          { 
            title: 'Solved Questions', 
            value: questions.filter(q => q.acceptedAnswerId).length, 
            icon: CheckCircle, 
            gradient: 'from-green-500 to-emerald-500',
            change: '+8%',
            changeType: 'positive'
          },
          { 
            title: 'Active Tags', 
            value: tags.length, 
            icon: Award, 
            gradient: 'from-purple-500 to-pink-500',
            change: '+5%',
            changeType: 'positive'
          },
          { 
            title: 'Total Views', 
            value: questions.reduce((sum, q) => sum + q.views, 0), 
            icon: Eye, 
            gradient: 'from-orange-500 to-red-500',
            change: '+23%',
            changeType: 'positive'
          }
        ].map((stat, index) => (
          <div key={index} className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Enhanced Filters */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Filter className="text-gray-500 dark:text-gray-400" size={20} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTag ? `Questions tagged with "${tags.find(t => t.id === selectedTag)?.name}"` : 'Discover Questions'}
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setFilter(option.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        filter === option.id
                          ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{option.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedTag && (
              <div className="mt-4 flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Filtered by:</span>
                <span
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                  style={{ 
                    backgroundColor: `${tags.find(t => t.id === selectedTag)?.color}20`,
                    color: tags.find(t => t.id === selectedTag)?.color 
                  }}
                >
                  {tags.find(t => t.id === selectedTag)?.name}
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No questions found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {selectedTag ? 'Try removing the tag filter or' : ''} Be the first to ask a question and help build our community!
                </p>
                {isAuthenticated && (
                  <Link
                    to="/ask"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Zap size={20} />
                    <span>Ask First Question</span>
                  </Link>
                )}
              </div>
            ) : (
              filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex space-x-6">
                    {/* Enhanced Vote/Stats Column */}
                    <div className="flex flex-col items-center space-y-3 text-sm">
                      <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 min-w-[80px]">
                        <button
                          onClick={() => handleVote(question.id, 'up')}
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            question.userVote === 'up'
                              ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 shadow-lg'
                              : 'hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          disabled={!isAuthenticated}
                        >
                          <ArrowUp size={20} />
                        </button>
                        <span className={`font-bold text-lg ${
                          question.votes > 0 ? 'text-green-600 dark:text-green-400' : 
                          question.votes < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {question.votes}
                        </span>
                        <button
                          onClick={() => handleVote(question.id, 'down')}
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            question.userVote === 'down'
                              ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 shadow-lg'
                              : 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                          disabled={!isAuthenticated}
                        >
                          <ArrowDown size={20} />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`flex items-center space-x-1 px-3 py-2 rounded-xl ${
                          question.acceptedAnswerId 
                            ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                            : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {question.acceptedAnswerId && <CheckCircle size={14} />}
                          <span className="font-semibold">{question.answerCount}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">answers</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <Eye size={14} />
                          <span className="font-semibold">{question.views}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">views</span>
                      </div>
                    </div>

                    {/* Enhanced Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <Link
                          to={`/questions/${question.id}`}
                          className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2"
                        >
                          {question.title}
                        </Link>
                        {question.isBookmarked && (
                          <Star className="text-yellow-500 ml-3 flex-shrink-0" size={20} fill="currentColor" />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => setSelectedTag(tag.id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium hover:opacity-80 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                            style={{ 
                              backgroundColor: `${tag.color}15`,
                              color: tag.color,
                              border: `1px solid ${tag.color}30`
                            }}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">
                                {question.author.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div>
                            <Link
                              to={`/users/${question.author.id}`}
                              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {question.author.username}
                            </Link>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Award size={12} className="text-yellow-500" />
                              <span>{question.author.reputation} rep</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>

                        {filter === 'hot' && (
                          <div className="flex items-center space-x-1 text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-xl">
                            <Flame size={14} />
                            <span className="text-xs font-semibold">HOT</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="text-white" size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Popular Tags</h3>
            </div>
            <div className="space-y-3">
              {popularTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 group ${
                    selectedTag === tag.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-lg'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-lg shadow-sm"
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tag.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {tag.questionCount} questions
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {tag.questionCount}
                  </div>
                </button>
              ))}
            </div>
            <Link
              to="/tags"
              className="block mt-6 text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold py-2 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
            >
              View all tags →
            </Link>
          </div>

          {/* Quick Actions */}
          {isAuthenticated && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="text-white" size={16} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Link
                  to="/ask"
                  className="flex items-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <MessageCircle size={20} />
                  <span className="font-semibold">Ask Question</span>
                  <Sparkles size={16} className="ml-auto" />
                </Link>
                <Link
                  to="/tags"
                  className="flex items-center space-x-3 w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-xl transition-all duration-300"
                >
                  <Award size={20} />
                  <span className="font-semibold">Browse Tags</span>
                </Link>
                <Link
                  to="/learning"
                  className="flex items-center space-x-3 w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-xl transition-all duration-300"
                >
                  <BookOpen size={20} />
                  <span className="font-semibold">Learning Path</span>
                </Link>
              </div>
            </div>
          )}

          {/* Community Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg border border-blue-200/50 dark:border-gray-600/50">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Community</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Active today</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Questions today</span>
                <span className="font-bold text-green-600 dark:text-green-400">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Answers today</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};