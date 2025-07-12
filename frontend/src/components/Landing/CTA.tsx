import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-medium-teal to-deep-teal">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-off-white mb-6">
          Ready to unlock your potential?
        </h2>
        <p className="text-xl text-off-white/80 mb-8 max-w-2xl mx-auto">
          Join our growing community of learners and mentors
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link to="/auth">
            {" "}
            <button className="bg-light-teal hover:bg-light-teal/90 text-deep-teal px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
              Get Started - It's Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <div className="text-off-white/80">
          <p className="mb-4">
            <strong className="text-off-white">
              No subscription fees. No course markups. No corporate middlemen.
            </strong>
          </p>
          <p>
            Just authentic connections between people who want to learn and
            those who love to teach.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
