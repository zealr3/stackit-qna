import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, HelpCircle, Lightbulb, Sparkles, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { RichTextEditor } from '../components/RichTextEditor';
import { useAuth } from '../hooks/useAuth';
import { Question, Tag as TagType } from '../types';

export const AskQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const savedTags = localStorage.getItem('qa_tags');
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    }
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!content.trim() || content === '<p></p>') {
      newErrors.content = 'Question content is required';
    } else if (content.length < 30) {
      newErrors.content = 'Question content must be at least 30 characters';
    }

    if (selectedTags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    } else if (selectedTags.length > 5) {
      newErrors.tags = 'Maximum 5 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setIsSubmitting(true);

    const question: Question = {
      id: Date.now().toString(),
      title: title.trim(),
      content,
      author: user,
      tags: selectedTags,
      votes: 0,
      views: 0,
      answerCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userVote: null
    };

    // Save to localStorage
    const savedQuestions = localStorage.getItem('qa_questions');
    const questions = savedQuestions ? JSON.parse(savedQuestions) : [];
    questions.unshift(question);
    localStorage.setItem('qa_questions', JSON.stringify(questions));

    // Update tag question counts
    const updatedTags = availableTags.map(tag => {
      if (selectedTags.some(selectedTag => selectedTag.id === tag.id)) {
        return { ...tag, questionCount: tag.questionCount + 1 };
      }
      return tag;
    });
    localStorage.setItem('qa_tags', JSON.stringify(updatedTags));

    setIsSubmitting(false);
    navigate(`/questions/${question.id}`);
  };

  const handleTagSelect = (tag: TagType) => {
    if (!selectedTags.some(t => t.id === tag.id) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  const createNewTag = () => {
    if (tagInput.trim() && selectedTags.length < 5) {
      const newTag: TagType = {
        id: Date.now().toString(),
        name: tagInput.trim().toLowerCase(),
        description: `Tag for ${tagInput.trim()}`,
        questionCount: 0,
        color: '#6366F1'
      };

      setSelectedTags([...selectedTags, newTag]);
      setAvailableTags([...availableTags, newTag]);
      localStorage.setItem('qa_tags', JSON.stringify([...availableTags, newTag]));
      setTagInput('');
    }
  };

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
    !selectedTags.some(selectedTag => selectedTag.id === tag.id)
  );

  const guidelines = [
    {
      icon: Target,
      title: "Be specific and clear",
      description: "Write a title that summarizes your specific problem"
    },
    {
      icon: Lightbulb,
      title: "Provide context",
      description: "Explain what you've tried and what you expected to happen"
    },
    {
      icon: CheckCircle,
      title: "Include relevant details",
      description: "Add code examples, error messages, or screenshots if helpful"
    },
    {
      icon: Tag,
      title: "Tag appropriately",
      description: "Use relevant tags to help others find and answer your question"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border border-blue-200/50 dark:border-gray-600/50">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ask a Question
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get help from our community of developers. The more details you provide, the better answers you'll receive.
        </p>
      </div>

      {/* Enhanced Guidelines */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Lightbulb className="text-white" size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Writing a Great Question</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <guideline.icon className="text-white" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{guideline.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enhanced Title Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Target className="text-white" size={16} />
            </div>
            <label htmlFor="title" className="text-lg font-bold text-gray-900 dark:text-white">
              Question Title
            </label>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Be specific and imagine you're asking a question to another person. Include the main technology or concept.
          </p>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How do I implement JWT authentication in React with TypeScript?"
            className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg ${
              errors.title 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          />
          {errors.title && (
            <div className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              <p className="text-sm font-medium">{errors.title}</p>
            </div>
          )}
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {title.length}/100 characters
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <HelpCircle className="text-white" size={16} />
            </div>
            <label className="text-lg font-bold text-gray-900 dark:text-white">
              Question Details
            </label>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Provide all the information someone would need to answer your question. Include code examples, error messages, and what you've already tried.
          </p>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Describe your problem in detail. Include:
• What you're trying to achieve
• What you've already tried
• Any error messages you're seeing
• Relevant code examples
• Your expected vs actual results"
            className={`${errors.content ? 'border-red-300 dark:border-red-600' : ''}`}
          />
          {errors.content && (
            <div className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              <p className="text-sm font-medium">{errors.content}</p>
            </div>
          )}
        </div>

        {/* Enhanced Tags Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Tag className="text-white" size={16} />
            </div>
            <label className="text-lg font-bold text-gray-900 dark:text-white">
              Tags ({selectedTags.length}/5)
            </label>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add up to 5 tags to describe what your question is about. Tags help others find and answer your question.
          </p>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag.id)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredTags.length > 0) {
                    handleTagSelect(filteredTags[0]);
                  } else if (tagInput.trim()) {
                    createNewTag();
                  }
                }
              }}
              placeholder="Start typing to search or create tags..."
              className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                errors.tags 
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              disabled={selectedTags.length >= 5}
            />

            {/* Tag Suggestions */}
            {tagInput && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                {filteredTags.length > 0 ? (
                  filteredTags.slice(0, 5).map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-lg"
                            style={{ backgroundColor: tag.color }}
                          ></div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white">{tag.name}</span>
                            {tag.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tag.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {tag.questionCount} questions
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={createNewTag}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Tag size={16} className="text-white" />
                      </div>
                      <span className="font-semibold">Create tag "{tagInput.trim()}"</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {errors.tags && (
            <div className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              <p className="text-sm font-medium">{errors.tags}</p>
            </div>
          )}
        </div>

        {/* Enhanced Submit Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Ready to post?</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review your question before submitting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Post Question</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Enhanced Help Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-600/50">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <HelpCircle className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Need help with formatting?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="space-y-2">
                <p className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Use the toolbar above to format your text</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Include code examples in code blocks</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Add links to relevant documentation</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Break up long text with headings and lists</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};