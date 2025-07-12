import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";


export default function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const addTag = () => {
    if (
      currentTag.trim() &&
      !tags.includes(currentTag.trim()) &&
      tags.length < 5
    ) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({ title, description, tags });
    // Redirect to home page or the new question page
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <button className="bg-transparent hover:bg-gray-100 rounded p-2">
                <ArrowLeft className="h-4 w-4" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Ask a Question</h1>
          </div>

          {/* Guidelines Card */}
          <div className="bg-white rounded shadow mb-8 p-6">
            <h2 className="text-lg font-semibold mb-2">
              Writing a good question
            </h2>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Be specific and clear in your title</li>
              <li>• Provide enough context in the description</li>
              <li>• Add relevant tags to help others find your question</li>
              <li>• Include code examples if applicable</li>
              <li>• Search for similar questions before posting</li>
            </ul>
          </div>

          {/* Question Form */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Question</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="font-medium">
                  Title *
                </label>
                <input
                  id="title"
                  placeholder="e.g., How to implement authentication in Next.js?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-base border rounded w-full p-2"
                />
                <p className="text-sm text-gray-500">
                  Be specific and imagine you're asking a question to another
                  person
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="font-medium">
                  Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Provide more details about your question. Include what you've tried, what you expected to happen, and what actually happened."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={8}
                  className="text-base resize-none border rounded w-full p-2"
                />
                <p className="text-sm text-gray-500">
                  Include all the information someone would need to answer your
                  question
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="tags"
                    placeholder="Add a tag (press Enter)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={tags.length >= 5}
                    className="flex-1 border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim() || tags.length >= 5}
                    className="border rounded px-2 py-2 bg-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Add up to 5 tags to describe what your question is about (e.g.,
                  javascript, react, nodejs)
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!title.trim() || !description.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded sm:w-auto"
                >
                  Post Your Question
                </button>
                <Link to="/" className="sm:w-auto">
                  <button
                    type="button"
                    className="border px-4 py-2 rounded bg-white w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}