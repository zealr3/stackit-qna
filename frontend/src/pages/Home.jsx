import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, Filter, Search } from 'lucide-react';

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: "How to implement authentication in Next.js 14?",
    description:
      "I'm trying to set up authentication in my Next.js 14 application using the app router. What's the best approach for handling user sessions and protecting routes?",
    tags: ["nextjs", "authentication", "react"],
    answers: 5,
    views: 234,
    createdAt: "2 hours ago",
    author: "john_dev",
  },
  {
    id: 2,
    title: "Best practices for React state management in 2024?",
    description:
      "With so many state management solutions available (Redux, Zustand, Context API), what are the current best practices for managing state in large React applications?",
    tags: ["react", "state-management", "redux", "zustand"],
    answers: 12,
    views: 567,
    createdAt: "4 hours ago",
    author: "sarah_react",
  },
  {
    id: 3,
    title: "How to optimize database queries in PostgreSQL?",
    description:
      "My PostgreSQL queries are running slowly on large datasets. What are some effective strategies for optimizing query performance?",
    tags: ["postgresql", "database", "performance"],
    answers: 0,
    views: 89,
    createdAt: "6 hours ago",
    author: "db_expert",
  },
  {
    id: 4,
    title: "Deploying Docker containers to AWS ECS",
    description:
      "I need help with deploying my containerized application to AWS ECS. What's the step-by-step process and what are the common pitfalls to avoid?",
    tags: ["docker", "aws", "ecs", "deployment"],
    answers: 8,
    views: 345,
    createdAt: "8 hours ago",
    author: "cloud_ninja",
  },
  {
    id: 5,
    title: "TypeScript generics with React components",
    description:
      "I'm struggling to understand how to properly use TypeScript generics when creating reusable React components. Can someone explain with practical examples?",
    tags: ["typescript", "react", "generics"],
    answers: 3,
    views: 156,
    createdAt: "1 day ago",
    author: "ts_learner",
  },
];

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const filteredQuestions = mockQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterType === "unanswered") {
      return matchesSearch && question.answers === 0;
    }
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Questions & Answers</h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link to="/ask">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask New Question
              </button>
            </Link>

            <button
              className="w-full sm:w-auto border px-4 py-2 rounded flex items-center"
              onClick={() => setFilterType(filterType === "unanswered" ? "all" : "unanswered")}
            >
              <Clock className="w-4 h-4 mr-2" />
              {filterType === "unanswered" ? "Show All Questions" : "Newest Unanswered"}
            </button>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full sm:w-48 border px-4 py-2 rounded flex items-center"
            >
              <option value="all">All Questions</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search questions, tags, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 border rounded w-full py-2"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 mb-8">
          {currentQuestions.length === 0 ? (
            <div className="bg-white p-8 text-center rounded shadow">
              <p className="text-gray-400">No questions found matching your criteria.</p>
            </div>
          ) : (
            currentQuestions.map((question) => (
              <div key={question.id} className="bg-white rounded shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3">
                  <Link to={`/question/${question.id}`} className="flex-1">
                    <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">{question.title}</h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {question.answers} answers
                    </span>
                    <span>{question.views} views</span>
                  </div>
                </div>
                <p className="text-gray-500 mb-3 line-clamp-2">{question.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span key={tag} className="bg-gray-200 text-xs px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400">
                    Asked by <span className="font-medium">{question.author}</span> • {question.createdAt}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              className="border px-4 py-2 rounded"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`w-10 border px-2 py-2 rounded ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="border px-4 py-2 rounded"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;