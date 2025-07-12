import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuestionDetail from './pages/QuestionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/navbar';
import AskQuestion from './pages/AskQuestion';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="mb-4 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="text-blue-600 underline">Go Home</a>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;