import { useNavigate } from 'react-router';
import { AlertTriangle } from 'lucide-react';
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <AlertTriangle className="w-24 h-24 text-rose-300 mb-6" />
      <h1 className="text-6xl font-semibold text-gray-700 mb-3">404</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-md text-center">
        Sorry, the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-rose-200 text-rose-900 rounded-lg hover:bg-rose-300 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
