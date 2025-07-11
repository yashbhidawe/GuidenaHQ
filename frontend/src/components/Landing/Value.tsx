import { MessageCircle, TrendingUp, Users, Video } from "lucide-react";

const Value = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Direct Connections",
      description:
        "Skip the courses. Connect directly with real people who've mastered what you want to learn.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Two-Way Learning",
      description:
        "Everyone teaches. Everyone learns. Share your Python skills while learning Spanish from someone across the globe.",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Built for Connection",
      description:
        "Real-time chat, video calls, and session scheduling - all in one platform designed for meaningful mentorship.",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Progress That Matters",
      description:
        "Track your mentorship journey, build lasting relationships, and grow your network as you grow your skills.",
    },
  ];

  return (
    <section className="py-20 bg-off-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-6">
            What Makes Us Different
          </h2>
          <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
            Experience learning that's personal, practical, and powerful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-deep-teal/20 text-deep-teal mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-deep-teal mb-3">
                {feature.title}
              </h3>
              <p className="text-deep-teal/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Value;
