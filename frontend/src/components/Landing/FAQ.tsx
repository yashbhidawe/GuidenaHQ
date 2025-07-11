import { ChevronRight } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does GuidenaHQ work?",
      answer:
        "GuidenaHQ is a peer-to-peer learning platform where you can find mentors for skills you want to learn and offer mentorship in areas where you have expertise. Simply create a profile, browse available mentors or mentees, send connection requests, and start learning together.",
    },
    {
      question: "Is GuidenaHQ free to use?",
      answer:
        "Yes, GuidenaHQ is completely free to use. We believe knowledge should be accessible to everyone, so there are no subscription fees or hidden charges.",
    },
    {
      question: "What kind of skills can I learn or teach?",
      answer:
        "Anything! From technical skills like programming and design to languages, music, cooking, business skills, and creative pursuits. If someone knows it and is willing to teach it, you can learn it on GuidenaHQ.",
    },
    {
      question: "How do I find the right mentor?",
      answer:
        "Use our search and filter features to find mentors based on skills, experience level, location, and availability. You can also browse profiles to find someone whose teaching style matches your learning preferences.",
    },
    {
      question: "What if I'm not an expert? Can I still be a mentor?",
      answer:
        "Absolutely! You don't need to be a world-class expert. If you have knowledge or experience that could help someone else, you can be a mentor. Teaching others is also a great way to reinforce your own learning.",
    },
    {
      question: "How do mentorship sessions work?",
      answer:
        "Sessions are flexible and arranged between you and your mentor/mentee. You can chat through our messaging system, schedule video calls, or even meet in person if you're in the same area. The format depends on what works best for both parties.",
    },
    {
      question: "Is there a time commitment required?",
      answer:
        "No fixed time commitment. Some mentorship relationships might be a single session to answer specific questions, while others might be ongoing relationships. It's entirely up to you and your mentor/mentee to decide what works best.",
    },
    {
      question: "How do I stay safe while using the platform?",
      answer:
        "We encourage all interactions to start through our platform's messaging system. Never share personal information early on, and trust your instincts. Report any suspicious behavior to our support team immediately.",
    },
  ];

  return (
    <section className="py-20 bg-off-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
            Everything you need to know about getting started with GuidenaHQ.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-light-teal/20 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-light-teal/5 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-deep-teal text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-medium-teal transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? "rotate-90" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-deep-teal/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-deep-teal/70 mb-4">Still have questions?</p>
          <a href="mailto:guidenahq@gmail.com">
            <button className="bg-medium-teal hover:bg-medium-teal/90 text-off-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Contact Support
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
