import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
          Privacy Policy
        </h1>
        <p className="text-slate-500 mb-8">Last updated: July 24, 2026</p>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              1. Information We Collect
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We collect information you provide directly, including your name,
              email address, profile picture, skills, experience, and any
              content you share in messages or meetings. We also collect usage
              data such as pages visited, features used, and interaction patterns
              to improve our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Your information is used to provide and improve our mentorship
              services, match you with relevant mentors or mentees, facilitate
              communication, send notifications about your mentorship activities,
              and ensure platform security. We do not sell your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              3. Data Sharing
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We share your information only with other platform members as
              necessary for mentorship interactions (e.g., your name and skills
              are visible to potential mentors/mentees). We may share data with
              service providers who assist in operating the platform, and we may
              disclose information if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              4. Data Security
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures including
              encryption, secure authentication, and regular security audits.
              However, no method of transmission over the Internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              5. Your Rights
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You can access, update, or delete your account information at any
              time through your profile settings. You may also request a copy of
              all data we hold about you by contacting us at
              guidenahq@gmail.com. Account deletion will remove all your data
              from our active systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              6. Contact Us
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at <span className="font-semibold">guidenahq@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
