import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUp, ArrowDown, Share, Bookmark, Flag, MessageSquare } from "lucide-react";


// Mock data for the question and answers
const mockQuestion = {
  id: 1,
  title: "How to implement authentication in Next.js 14?",
  description: `I'm trying to set up authentication in my Next.js 14 application using the app router. What's the best approach for handling user sessions and protecting routes?

I've looked into several options:
1. NextAuth.js (now Auth.js)
2. Supabase Auth
3. Custom JWT implementation

Here's what I've tried so far:

// app/api/auth/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password } = await request.json()
  // Authentication logic here
  return NextResponse.json({ success: true })
}

But I'm struggling with:
- How to protect routes properly
- Managing user sessions across the app
- Best practices for storing tokens

Any guidance would be greatly appreciated!`,
  tags: ["nextjs", "authentication", "react"],
  votes: 15,
  views: 234,
  createdAt: "2 hours ago",
  author: {
    name: "john_dev",
    reputation: 1250,
  },
};

const mockAnswers = [
  {
    id: 1,
    content: `For Next.js 14 with the app router, I'd recommend using **Auth.js** (formerly NextAuth.js) as it's specifically designed for Next.js and handles most of the complexity for you.

Here's a basic setup:

// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
  },
})

export { GET }

For protecting routes, you can use middleware:

// middleware.js
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}

This approach handles sessions automatically and provides excellent TypeScript support.`,
    votes: 12,
    createdAt: "1 hour ago",
    author: {
      name: "auth_expert",
      reputation: 3450,
    },
    isAccepted: true,
  },
  {
    id: 2,
    content: `If you want more control over your authentication flow, I'd suggest using **Supabase Auth**. It's simpler to set up and gives you a complete backend.

// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

For route protection, create a custom hook:

// hooks/useAuth.js
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

Supabase also provides Row Level Security (RLS) for database-level protection.`,
    votes: 8,
    createdAt: "45 minutes ago",
    author: {
      name: "supabase_fan",
      reputation: 2100,
    },
    isAccepted: false,
  },
];

export default function QuestionDetail() {
  const [newAnswer, setNewAnswer] = useState("");
  const [questionVotes, setQuestionVotes] = useState(mockQuestion.votes);
  const [answerVotes, setAnswerVotes] = useState(
    mockAnswers.reduce((acc, answer) => ({ ...acc, [answer.id]: answer.votes }), {})
  );

  const handleVote = (type, id, direction) => {
    if (type === "question") {
      setQuestionVotes((prev) => (direction === "up" ? prev + 1 : prev - 1));
    } else if (id) {
      setAnswerVotes((prev) => ({
        ...prev,
        [id]: direction === "up" ? prev[id] + 1 : prev[id] - 1,
      }));
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (newAnswer.trim()) {
      // Here you would typically send the answer to your backend
      setNewAnswer("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-gray-100 rounded">
                <ArrowLeft className="h-4 w-4" />
                Back to Questions
              </button>
            </Link>
          </div>

          {/* Question */}
          <div className="bg-white rounded shadow mb-8 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Vote Section */}
              <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-1">
                <button
                  className="h-8 w-8 bg-transparent hover:bg-gray-100 rounded"
                  onClick={() => handleVote("question", null, "up")}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <span className="font-semibold text-lg">{questionVotes}</span>
                <button
                  className="h-8 w-8 bg-transparent hover:bg-gray-100 rounded"
                  onClick={() => handleVote("question", null, "down")}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold mb-4">{mockQuestion.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Asked {mockQuestion.createdAt}</span>
                  <span>{mockQuestion.views} views</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockQuestion.tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 text-xs px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-2">
                <button className="flex items-center gap-2 px-2 py-1 bg-transparent hover:bg-gray-100 rounded">
                  <Share className="h-4 w-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-2 py-1 bg-transparent hover:bg-gray-100 rounded">
                  <Bookmark className="h-4 w-4" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-2 py-1 bg-transparent hover:bg-gray-100 rounded">
                  <Flag className="h-4 w-4" />
                  Flag
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none mt-6 mb-6">
              <pre className="whitespace-pre-wrap font-sans">{mockQuestion.description}</pre>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg">
                {mockQuestion.author.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{mockQuestion.author.name}</p>
                <p className="text-sm text-gray-500">{mockQuestion.author.reputation} reputation</p>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">{mockAnswers.length} Answers</h2>
            <div className="space-y-6">
              {mockAnswers.map((answer) => (
                <div key={answer.id} className={`bg-white rounded shadow p-6 ${answer.isAccepted ? "border border-green-200 bg-green-50/50" : ""}`}>
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Vote Section */}
                    <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-1">
                      <button
                        className="h-8 w-8 bg-transparent hover:bg-gray-100 rounded"
                        onClick={() => handleVote("answer", answer.id, "up")}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <span className="font-semibold">{answerVotes[answer.id]}</span>
                      <button
                        className="h-8 w-8 bg-transparent hover:bg-gray-100 rounded"
                        onClick={() => handleVote("answer", answer.id, "down")}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      {answer.isAccepted && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mt-2">Accepted</span>
                      )}
                    </div>
                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none mb-4">
                        <pre className="whitespace-pre-wrap font-sans">{answer.content}</pre>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                            {answer.author.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{answer.author.name}</p>
                            <p className="text-xs text-gray-500">{answer.author.reputation} reputation</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">Answered {answer.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Answer Form */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <textarea
                placeholder="Write your answer here... You can use markdown formatting."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={8}
                className="resize-none w-full border rounded p-2"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={!newAnswer.trim()} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Post Your Answer
                </button>
                <button type="button" className="border px-4 py-2 rounded bg-white">
                  Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}