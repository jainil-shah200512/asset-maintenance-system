import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-3 text-slate-600">Page not found</p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default NotFound;