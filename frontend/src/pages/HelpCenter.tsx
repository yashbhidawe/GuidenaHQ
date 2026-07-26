import { Link } from "react-router-dom";
import { ArrowLeft, Search, BookOpen, MessageCircle, Shield } from "lucide-react";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      'Click "Create an account" on the login page, fill in your details, select your role (mentor/mentee/both), add your skills, and you\'re ready to go!',
  },
  {
    question: "How do I find a mentor?",
    answer:
      "Use the search bar to search by skill or name. Browse mentor profiles, check their skills and experience, then send a mentorship request.",
  },
  {
    question: "How does the mentorship system work?",
    answer:
      "Send a request to a mentor. Once accepted, you can chat, schedule meetings, and track your mentorship progress through the Mentorships page.",
  },
  {
    question: "How do I schedule a meeting?",
    answer:
      "Navigate to the Meetings page, click 'Schedule Meeting', select your mentor/mentee, choose a date and time, and send the invitation.",
  },
  {
    question: "Can I be both a mentor and mentee?",
    answer:
      "Yes! During signup, select the 'Both' role. You can offer skills as a mentor and learn skills as a mentee simultaneously.",
  },
  {
    question: "How do I edit my profile?",
    answer:
      "Click on your profile in the navbar, then click the 'Edit Profile' button. You can update your name, skills, experience, and avatar.",
  },
];

const HelpCenter = () => {
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

        <h1 className="text-3xl font-bold text-slate-800 mb-4">Help Center</h1>
        <p className="text-slate-600 mb-8">
          Find answers to common questions and get the help you need.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <Search className="w-8 h-8 text-teal-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Search</h3>
            <p className="text-sm text-slate-500">Find mentors by skill or name</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <BookOpen className="w-8 h-8 text-teal-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Learn</h3>
            <p className="text-sm text-slate-500">Browse guides and tutorials</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <MessageCircle className="w-8 h-8 text-teal-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Contact</h3>
            <p className="text-sm text-slate-500">Reach out to our support team</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group"
            >
              <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                {faq.question}
                <span className="text-teal-700 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-slate-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
