import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-zinc-700">404</h1>
      <p className="text-xl text-zinc-400 mt-4">Page not found</p>
      <Link
        to="/"
        className="inline-block mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
