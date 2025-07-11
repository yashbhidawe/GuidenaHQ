import { ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Share what you know and what you want to learn. Our matching system does the rest.",
      color: "medium-teal",
    },
    {
      number: "02",
      title: "Discover Your Match",
      description:
        "Browse mentors by skill or experience. Find someone who gets your learning style.",
      color: "light-teal",
    },
    {
      number: "03",
      title: "Connect & Grow",
      description:
        "Send a request, start chatting, and schedule your first session. Learning happens at your pace.",
      color: "deep-teal",
    },
    {
      number: "04",
      title: "Pay It Forward",
      description:
        "As you grow, become a mentor yourself. Help others while strengthening your own expertise.",
      color: "medium-teal",
    },
  ];

  return (
    <section className="py-20 bg-off-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-6">
            How It Works
          </h2>
          <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
            Start your learning journey in just four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${step.color}/20 text-${step.color} text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-deep-teal mb-4">
                {step.title}
              </h3>
              <p className="text-deep-teal/70 leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-8 h-8 -ml-4">
                  <ChevronRight className="w-6 h-6 text-medium-teal/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
