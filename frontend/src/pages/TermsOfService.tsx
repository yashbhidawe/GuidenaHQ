import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
          Terms of Service
        </h1>
        <p className="text-slate-500 mb-8">Last updated: July 24, 2026</p>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using GuidenaHQ, you agree to be bound by these
              Terms of Service. If you do not agree, do not use the platform.
              We reserve the right to modify these terms at any time, and
              continued use constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              2. User Accounts
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You must be at least 13 years old to create an account. You are
              responsible for maintaining the confidentiality of your
              credentials and for all activities under your account. Provide
              accurate information and keep it updated. One person may not
              maintain more than one account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              3. Mentorship Interactions
            </h2>
            <p className="text-slate-600 leading-relaxed">
              GuidenaHQ facilitates mentorship connections but is not a party to
              any agreement between mentors and mentees. We do not guarantee
              outcomes from mentorship relationships. Users are responsible for
              their own conduct during mentorship interactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              4. Content and Intellectual Property
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You retain ownership of content you create on the platform. By
              posting content, you grant GuidenaHQ a non-exclusive license to
              display, store, and share that content within the platform. You
              must not share content that infringes on others' intellectual
              property rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              5. Prohibited Conduct
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You may not use the platform to harass, bully, or harm others;
              distribute spam or misleading content; attempt to gain unauthorized
              access to any part of the platform; use automated tools to access
              the platform; or engage in any activity that violates applicable
              laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              6. Termination
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We may suspend or terminate your account at any time for
              violations of these terms or for any other reason at our
              discretion. Upon termination, your right to use the platform
              ceases immediately. We may retain certain data as required by law
              or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              7. Contact
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Questions about these Terms? Contact us at{" "}
              <span className="font-semibold">guidenahq@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
