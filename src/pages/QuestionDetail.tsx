import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Eye, 
  CheckCircle,
  Star,
  Flag,
  Share2,
  Bookmark,
  MoreHorizontal,
  Award,
  Clock,
  User as UserIcon,
  Sparkles,
  ThumbsUp,
  Heart,
  Zap
} from 'lucide-react';
import { Question, Answer, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { RichTextEditor } from '../components/RichTextEditor';

export const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    if (id) {
      const savedQuestions = localStorage.getItem('qa_questions');
      const savedAnswers = localStorage.getItem('qa_answers');
      
      if (savedQuestions) {
        const questions = JSON.parse(savedQuestions);
        const foundQuestion = questions.find((q: Question) => q.id === id);
        if (foundQuestion) {
          // Increment view count
          const updatedQuestion = { ...foundQuestion, views: foundQuestion.views + 1 };
          setQuestion(updatedQuestion);
          
          // Update localStorage
          const updatedQuestions = questions.map((q: Question) =>
            q.id === id ? updatedQuestion : q
          );
          localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
        }
      }
      
      if (savedAnswers) {
        const allAnswers = JSON.parse(savedAnswers);
        const questionAnswers = allAnswers.filter((a: Answer) => a.questionId === id);
        setAnswers(questionAnswers);
      }
    }
  }, [id]);

  const handleVote = (type: 'question' | 'answer', targetId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) return;

    if (type === 'question' && question) {
      const currentVote = question.userVote;
      let newVotes = question.votes;
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

      const updatedQuestion = { ...question, votes: newVotes, userVote: newUserVote };
      setQuestion(updatedQuestion);

      // Update localStorage
      const savedQuestions = localStorage.getItem('qa_questions');
      if (savedQuestions) {
        const questions = JSON.parse(savedQuestions);
        const updatedQuestions = questions.map((q: Question) =>
          q.id === question.id ? updatedQuestion : q
        );
        localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
      }
    } else if (type === 'answer') {
      const updatedAnswers = answers.map(a => {
        if (a.id === targetId) {
          const currentVote = a.userVote;
          let newVotes = a.votes;
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

          return { ...a, votes: newVotes, userVote: newUserVote };
        }
        return a;
      });

      setAnswers(updatedAnswers);

      // Update localStorage
      const savedAnswers = localStorage.getItem('qa_answers');
      if (savedAnswers) {
        const allAnswers = JSON.parse(savedAnswers);
        const updatedAllAnswers = allAnswers.map((a: Answer) => {
          const updatedAnswer = updatedAnswers.find(ua => ua.id === a.id);
          return updatedAnswer || a;
        });
        localStorage.setItem('qa_answers', JSON.stringify(updatedAllAnswers));
      }
    }
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!question || !user || question.author.id !== user.id) return;

    const updatedAnswers = answers.map(a => ({
      ...a,
      isAccepted: a.id === answerId ? !a.isAccepted : false
    }));

    setAnswers(updatedAnswers);

    const updatedQuestion = {
      ...question,
      acceptedAnswerId: updatedAnswers.find(a => a.isAccepted)?.id || undefined
    };
    setQuestion(updatedQuestion);

    // Update localStorage
    const savedAnswers = localStorage.getItem('qa_answers');
    if (savedAnswers) {
      const allAnswers = JSON.parse(savedAnswers);
      const updatedAllAnswers = allAnswers.map((a: Answer) => {
        const updatedAnswer = updatedAnswers.find(ua => ua.id === a.id);
        return updatedAnswer || a;
      });
      localStorage.setItem('qa_answers', JSON.stringify(updatedAllAnswers));
    }

    const savedQuestions = localStorage.getItem('qa_questions');
    if (savedQuestions) {
      const questions = JSON.parse(savedQuestions);
      const updatedQuestions = questions.map((q: Question) =>
        q.id === question.id ? updatedQuestion : q
      );
      localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !user || !question) return;

    setIsSubmitting(true);

    const answer: Answer = {
      id: Date.now().toString(),
      content: newAnswer,
      author: user,
      questionId: question.id,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userVote: null
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    // Update localStorage
    const savedAnswers = localStorage.getItem('qa_answers');
    const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : [];
    allAnswers.push(answer);
    localStorage.setItem('qa_answers', JSON.stringify(allAnswers));

    // Update question answer count
    const updatedQuestion = { ...question, answerCount: question.answerCount + 1 };
    setQuestion(updatedQuestion);

    const savedQuestions = localStorage.getItem('qa_questions');
    if (savedQuestions) {
      const questions = JSON.parse(savedQuestions);
      const updatedQuestions = questions.map((q: Question) =>
        q.id === question.id ? updatedQuestion : q
      );
      localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
    }

    setNewAnswer('');
    setShowAnswerForm(false);
    setIsSubmitting(false);
  };

  const toggleBookmark = () => {
    if (!question || !user) return;

    const updatedQuestion = { ...question, isBookmarked: !question.isBookmarked };
    setQuestion(updatedQuestion);

    const savedQuestions = localStorage.getItem('qa_questions');
    if (savedQuestions) {
      const questions = JSON.parse(savedQuestions);
      const updatedQuestions = questions.map((q: Question) =>
        q.id === question.id ? updatedQuestion : q
      );
      localStorage.setItem('qa_questions', JSON.stringify(updatedQuestions));
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Question not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The question you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const sortedAnswers = answers.sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Enhanced Question Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 mr-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {question.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <span>{question.views.toLocaleString()} views</span>
              </div>
              {question.updatedAt !== question.createdAt && (
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} />
                  <span>Modified {formatDistanceToNow(new Date(question.updatedAt), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={toggleBookmark}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    question.isBookmarked
                      ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg'
                      : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                  title={question.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                >
                  <Bookmark size={20} fill={question.isBookmarked ? 'currentColor' : 'none'} />
                </button>
                <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                  <Share2 size={20} />
                </button>
                <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                  <Flag size={20} />
                </button>
                <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                  <MoreHorizontal size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-8">
          {/* Enhanced Vote Column */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 flex flex-col items-center space-y-3">
              <button
                onClick={() => handleVote('question', question.id, 'up')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  question.userVote === 'up'
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 shadow-lg transform scale-110'
                    : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-110'
                }`}
                disabled={!isAuthenticated}
              >
                <ArrowUp size={28} />
              </button>
              <span className={`text-2xl font-bold ${
                question.votes > 0 ? 'text-green-600 dark:text-green-400' : 
                question.votes < 0 ? 'text-red-600 dark:text-red-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {question.votes}
              </span>
              <button
                onClick={() => handleVote('question', question.id, 'down')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  question.userVote === 'down'
                    ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 shadow-lg transform scale-110'
                    : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110'
                }`}
                disabled={!isAuthenticated}
              >
                <ArrowDown size={28} />
              </button>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="flex-1">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {question.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/?tag=${tag.id}`}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                  style={{ 
                    backgroundColor: `${tag.color}15`,
                    color: tag.color,
                    border: `1px solid ${tag.color}30`
                  }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">
                      {question.author.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <div>
                  <Link
                    to={`/users/${question.author.id}`}
                    className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {question.author.username}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award size={14} className="text-yellow-500" />
                    <span>{question.author.reputation} reputation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Zap size={16} />
              <span>Answer Question</span>
            </button>
          )}
        </div>

        {/* Enhanced Answer Form */}
        {showAnswerForm && isAuthenticated && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Answer</h3>
            </div>
            <form onSubmit={handleSubmitAnswer} className="space-y-6">
              <RichTextEditor
                content={newAnswer}
                onChange={setNewAnswer}
                placeholder="Provide a detailed answer to help solve this question..."
                className="min-h-[200px]"
              />
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={!newAnswer.trim() || isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isSubmitting ? 'Posting...' : 'Post Answer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswerForm(false)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-6 py-3 rounded-xl transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Answers List */}
        {sortedAnswers.map((answer, index) => (
          <div
            key={answer.id}
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border transition-all duration-300 ${
              answer.isAccepted
                ? 'border-green-300 dark:border-green-700 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10'
                : 'border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex space-x-8">
              {/* Enhanced Vote Column */}
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleVote('answer', answer.id, 'up')}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      answer.userVote === 'up'
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 shadow-lg'
                        : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <ArrowUp size={24} />
                  </button>
                  <span className={`text-xl font-bold ${
                    answer.votes > 0 ? 'text-green-600 dark:text-green-400' : 
                    answer.votes < 0 ? 'text-red-600 dark:text-red-400' : 
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {answer.votes}
                  </span>
                  <button
                    onClick={() => handleVote('answer', answer.id, 'down')}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      answer.userVote === 'down'
                        ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 shadow-lg'
                        : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <ArrowDown size={24} />
                  </button>
                </div>
                
                {user && question?.author.id === user.id && (
                  <button
                    onClick={() => handleAcceptAnswer(answer.id)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      answer.isAccepted
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 shadow-lg'
                        : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={answer.isAccepted ? 'Remove acceptance' : 'Accept this answer'}
                  >
                    <CheckCircle size={24} fill={answer.isAccepted ? 'currentColor' : 'none'} />
                  </button>
                )}
              </div>

              {/* Enhanced Content */}
              <div className="flex-1">
                {answer.isAccepted && (
                  <div className="flex items-center space-x-3 mb-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-800 dark:text-green-300">Accepted Answer</span>
                    <Sparkles size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                />

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">
                          {answer.author.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div>
                      <Link
                        to={`/users/${answer.author.id}`}
                        className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {answer.author.username}
                      </Link>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Award size={14} className="text-yellow-500" />
                        <span>{answer.author.reputation} reputation</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                    <Clock size={14} />
                    <span>answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {answers.length === 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-12 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No answers yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Be the first to answer this question and help the community! Your expertise could make a difference.
            </p>
            {isAuthenticated && !showAnswerForm && (
              <button
                onClick={() => setShowAnswerForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <Zap size={20} />
                <span>Write the First Answer</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};