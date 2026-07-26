import { Link } from "react-router-dom";
import { ArrowLeft, Code, Key, BookOpen } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/profile",
    description: "Get the authenticated user's profile",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/profile/edit",
    description: "Update profile information",
    auth: true,
  },
  {
    method: "POST",
    path: "/signup",
    description: "Create a new user account",
    auth: false,
  },
  {
    method: "POST",
    path: "/login",
    description: "Authenticate and receive a JWT token",
    auth: false,
  },
  {
    method: "GET",
    path: "/search/:query",
    description: "Search users by name or skill",
    auth: true,
  },
  {
    method: "GET",
    path: "/feed/teach",
    description: "Get feed of users looking to learn",
    auth: true,
  },
  {
    method: "POST",
    path: "/chat/send/:receiverId",
    description: "Send a message to another user",
    auth: true,
  },
  {
    method: "GET",
    path: "/chat/:receiverId",
    description: "Get chat history with a user",
    auth: true,
  },
  {
    method: "POST",
    path: "/mentorship/request/:mentorId",
    description: "Send a mentorship request",
    auth: true,
  },
  {
    method: "GET",
    path: "/meetings",
    description: "Get all scheduled meetings",
    auth: true,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PATCH: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

const APIReference = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-teal-700 hover:text-teal-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">API Reference</h1>
        <p className="text-slate-600 mb-8">
          Explore the GuidenaHQ REST API. All authenticated endpoints require a
          Bearer token in the Authorization header.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <Code className="w-8 h-8 text-teal-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">REST API</h3>
            <p className="text-sm text-slate-500">JSON-based REST endpoints</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <Key className="w-8 h-8 text-teal-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">JWT Auth</h3>
            <p className="text-sm text-slate-500">Bearer token authentication</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <BookOpen className="w-8 h-8 text-teal-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Versioned</h3>
            <p className="text-sm text-slate-500">Stable and documented</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">Endpoints</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {endpoints.map((ep, index) => (
              <div key={index} className="p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded w-fit ${methodColors[ep.method]}`}
                >
                  {ep.method}
                </span>
                <code className="text-sm text-slate-700 font-mono flex-1">
                  {ep.path}
                </code>
                <span className="text-sm text-slate-500 flex-1">
                  {ep.description}
                </span>
                {ep.auth && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded w-fit">
                    Auth
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="font-semibold text-slate-800 mb-2">Base URL</h3>
          <code className="text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded">
            https://guidenahq.onrender.com
          </code>
        </div>
      </div>
    </div>
  );
};

export default APIReference;
