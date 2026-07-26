import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Shield, Users, AlertTriangle } from "lucide-react";

const CommunityGuidelines = () => {
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

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Community Guidelines
        </h1>
        <p className="text-slate-600 mb-8">
          Our guidelines help maintain a safe, respectful, and productive
          community for all members.
        </p>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-teal-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                Be Respectful
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Treat all community members with respect and dignity. Harassment,
              discrimination, hate speech, or personal attacks of any kind will
              not be tolerated. We are here to learn and grow together.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-teal-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                Collaborate Honestly
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Be honest in your mentorship interactions. Represent your skills
              and experience accurately. Provide genuine feedback and constructive
              criticism. Honor your commitments to mentees and mentors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-teal-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                Protect Privacy
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Respect the privacy of other members. Do not share personal
              information, conversation details, or meeting content without
              explicit consent. Use the platform's built-in messaging for
              communications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-teal-700" />
              <h2 className="text-xl font-semibold text-slate-800">
                No Spam or Misuse
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Do not send unsolicited messages, promote unrelated services, or
              misuse the platform for commercial purposes. Keep interactions
              relevant to mentorship and skill development.
            </p>
          </div>
        </div>

        <div className="mt-8 p-5 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-teal-800 text-sm">
            <strong>Violation Notice:</strong> Violations of these guidelines may
            result in warning, temporary suspension, or permanent removal from
            the platform. Report any violations to{" "}
            <span className="font-semibold">guidenahq@gmail.com</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
