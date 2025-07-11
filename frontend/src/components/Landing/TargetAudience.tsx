import { BookOpen, Briefcase, GraduationCap, Users } from "lucide-react";

const TargetAudience = () => {
  const audiences = [
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Students & New Graduates",
      description:
        "Bridge the gap between classroom theory and real-world application",
      bgColor: "bg-medium-teal/10",
      iconColor: "text-medium-teal",
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Working Professionals",
      description:
        "Level up your career or pivot to new skills without expensive courses",
      bgColor: "bg-light-teal/10",
      iconColor: "text-light-teal",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Experienced Experts",
      description:
        "Share your knowledge, build your network, and make a meaningful impact",
      bgColor: "bg-deep-teal/10",
      iconColor: "text-deep-teal",
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Lifelong Learners",
      description:
        "Explore new passions, from cooking to coding, with personalized guidance",
      bgColor: "bg-medium-teal/10",
      iconColor: "text-medium-teal",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-deep-teal/5 to-medium-teal/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-6">
            Perfect For
          </h2>
          <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
            Whether you're just starting out or looking to share your expertise,
            there's a place for you here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className={`${audience.bgColor} p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer`}
            >
              <div
                className={`${audience.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {audience.icon}
              </div>
              <h3 className="text-2xl font-semibold text-deep-teal mb-4">
                {audience.title}
              </h3>
              <p className="text-deep-teal/70 text-lg leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
