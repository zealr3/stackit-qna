import { User, Question, Answer, Tag, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@qa.com',
    role: 'admin',
    reputation: 10000,
    joinDate: '2023-01-01T00:00:00Z',
    bio: 'Platform administrator',
    isOnline: true
  },
  {
    id: '2',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    reputation: 1250,
    joinDate: '2024-01-15T00:00:00Z',
    bio: 'Full-stack developer passionate about React and Node.js',
    isOnline: true
  },
  {
    id: '3',
    username: 'sarah_dev',
    email: 'sarah@example.com',
    role: 'user',
    reputation: 890,
    joinDate: '2024-02-20T00:00:00Z',
    bio: 'Frontend specialist with expertise in modern web technologies',
    isOnline: false
  }
];

export const mockTags: Tag[] = [
  { id: '1', name: 'javascript', description: 'JavaScript programming language', questionCount: 1250, color: '#F7DF1E' },
  { id: '2', name: 'react', description: 'React.js library for building user interfaces', questionCount: 980, color: '#61DAFB' },
  { id: '3', name: 'typescript', description: 'TypeScript superset of JavaScript', questionCount: 750, color: '#3178C6' },
  { id: '4', name: 'nodejs', description: 'Node.js JavaScript runtime', questionCount: 650, color: '#339933' },
  { id: '5', name: 'css', description: 'Cascading Style Sheets', questionCount: 850, color: '#1572B6' },
  { id: '6', name: 'python', description: 'Python programming language', questionCount: 1100, color: '#3776AB' },
  { id: '7', name: 'html', description: 'HyperText Markup Language', questionCount: 400, color: '#E34F26' },
  { id: '8', name: 'mongodb', description: 'MongoDB NoSQL database', questionCount: 300, color: '#47A248' }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement proper error handling in React applications?',
    content: `<p>I'm building a React application and I want to implement comprehensive error handling. What are the best practices for:</p>
    <ul>
      <li>Catching and handling errors in components</li>
      <li>Global error boundaries</li>
      <li>Async operation error handling</li>
      <li>User-friendly error messages</li>
    </ul>
    <p>Any recommendations for libraries or patterns would be appreciated!</p>`,
    author: mockUsers[1],
    tags: [mockTags[1], mockTags[0]],
    votes: 25,
    views: 340,
    answerCount: 3,
    acceptedAnswerId: '1',
    createdAt: '2024-12-20T10:30:00Z',
    updatedAt: '2024-12-20T10:30:00Z',
    userVote: null
  },
  {
    id: '2',
    title: 'TypeScript generic constraints with multiple types',
    content: `<p>I'm working with TypeScript and trying to create a generic function that accepts objects with specific properties. How can I properly constrain generics to ensure type safety?</p>
    <pre><code>function processData&lt;T&gt;(data: T): T {
  // Need to ensure T has certain properties
  return data;
}</code></pre>
    <p>What's the best approach for this?</p>`,
    author: mockUsers[2],
    tags: [mockTags[2], mockTags[0]],
    votes: 18,
    views: 156,
    answerCount: 2,
    createdAt: '2024-12-19T14:22:00Z',
    updatedAt: '2024-12-19T14:22:00Z',
    userVote: null
  },
  {
    id: '3',
    title: 'Optimizing MongoDB queries for large datasets',
    content: `<p>I have a MongoDB collection with over 1 million documents and I'm experiencing slow query performance. The collection structure looks like this:</p>
    <pre><code>{
  _id: ObjectId,
  userId: String,
  timestamp: Date,
  data: Object,
  tags: [String]
}</code></pre>
    <p>What indexing strategies and query optimizations should I consider?</p>`,
    author: mockUsers[1],
    tags: [mockTags[7], mockTags[3]],
    votes: 42,
    views: 780,
    answerCount: 5,
    acceptedAnswerId: '3',
    createdAt: '2024-12-18T09:15:00Z',
    updatedAt: '2024-12-18T09:15:00Z',
    userVote: 'up'
  }
];

export const mockAnswers: Answer[] = [
  {
    id: '1',
    content: `<p>Great question! Here's a comprehensive approach to error handling in React:</p>
    <h3>1. Error Boundaries</h3>
    <pre><code>class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return &lt;h1&gt;Something went wrong.&lt;/h1&gt;;
    }
    return this.props.children;
  }
}</code></pre>
    <h3>2. Async Error Handling</h3>
    <p>Use try-catch blocks with async/await and proper error state management.</p>`,
    author: mockUsers[2],
    questionId: '1',
    votes: 15,
    isAccepted: true,
    createdAt: '2024-12-20T11:45:00Z',
    updatedAt: '2024-12-20T11:45:00Z',
    userVote: null
  },
  {
    id: '2',
    content: `<p>You can use generic constraints with the <code>extends</code> keyword:</p>
    <pre><code>interface HasId {
  id: string | number;
}

function processData&lt;T extends HasId&gt;(data: T): T {
  console.log(\`Processing item with id: \${data.id}\`);
  return data;
}</code></pre>
    <p>This ensures that T must have an 'id' property.</p>`,
    author: mockUsers[1],
    questionId: '2',
    votes: 12,
    isAccepted: false,
    createdAt: '2024-12-19T15:30:00Z',
    updatedAt: '2024-12-19T15:30:00Z',
    userVote: null
  },
  {
    id: '3',
    content: `<p>For optimizing MongoDB queries on large datasets, here are key strategies:</p>
    <h3>1. Proper Indexing</h3>
    <pre><code>// Compound index for common queries
db.collection.createIndex({ userId: 1, timestamp: -1 });

// Text index for tag searches
db.collection.createIndex({ tags: "text" });</code></pre>
    <h3>2. Query Optimization</h3>
    <ul>
      <li>Use projection to limit returned fields</li>
      <li>Implement pagination with skip/limit carefully</li>
      <li>Consider aggregation pipeline for complex queries</li>
    </ul>
    <h3>3. Performance Monitoring</h3>
    <p>Use <code>explain()</code> to analyze query execution plans.</p>`,
    author: mockUsers[0],
    questionId: '3',
    votes: 28,
    isAccepted: true,
    createdAt: '2024-12-18T10:20:00Z',
    updatedAt: '2024-12-18T10:20:00Z',
    userVote: 'up'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'New Answer',
    message: 'sarah_dev answered your question about React error handling',
    relatedId: '1',
    isRead: false,
    createdAt: '2024-12-20T11:45:00Z',
    actionUrl: '/questions/1'
  },
  {
    id: '2',
    type: 'vote',
    title: 'Upvote Received',
    message: 'Your answer received an upvote',
    relatedId: '3',
    isRead: false,
    createdAt: '2024-12-20T09:30:00Z',
    actionUrl: '/questions/3'
  },
  {
    id: '3',
    type: 'accepted',
    title: 'Answer Accepted',
    message: 'Your answer was marked as accepted',
    relatedId: '1',
    isRead: true,
    createdAt: '2024-12-19T16:20:00Z',
    actionUrl: '/questions/1'
  }
];

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('qa_users')) {
    localStorage.setItem('qa_users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('qa_questions')) {
    localStorage.setItem('qa_questions', JSON.stringify(mockQuestions));
  }
  if (!localStorage.getItem('qa_answers')) {
    localStorage.setItem('qa_answers', JSON.stringify(mockAnswers));
  }
  if (!localStorage.getItem('qa_tags')) {
    localStorage.setItem('qa_tags', JSON.stringify(mockTags));
  }
  if (!localStorage.getItem('qa_notifications')) {
    localStorage.setItem('qa_notifications', JSON.stringify(mockNotifications));
  }
};