import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react";

const openings = [
  {
    title: "Full Stack Developer",
    type: "Full-time",
    location: "Remote",
    team: "Engineering",
    description:
      "Build and maintain core platform features using React, Node.js, and MongoDB. Work closely with the product team to ship new features.",
  },
  {
    title: "UI/UX Designer",
    type: "Full-time",
    location: "Remote",
    team: "Design",
    description:
      "Design intuitive and beautiful user experiences for the mentorship platform. Create wireframes, prototypes, and high-fidelity mockups.",
  },
  {
    title: "DevOps Engineer",
    type: "Part-time",
    location: "Remote",
    team: "Infrastructure",
    description:
      "Manage cloud infrastructure, CI/CD pipelines, and monitoring. Ensure high availability and performance of the platform.",
  },
  {
    title: "Community Manager",
    type: "Part-time",
    location: "Remote",
    team: "Operations",
    description:
      "Grow and engage the GuidenaHQ community. Manage social media, create content, and support users.",
  },
];

const Careers = () => {
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

        <h1 className="text-3xl font-bold text-slate-800 mb-4">Careers</h1>
        <p className="text-slate-600 mb-8">
          Join us in building the future of mentorship. We're looking for
          passionate people who want to make a difference.
        </p>

        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white p-8 rounded-xl mb-10">
          <h2 className="text-2xl font-bold mb-3">Why GuidenaHQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-300" />
              <span className="text-teal-100">Small, impactful team</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-300" />
              <span className="text-teal-100">Fully remote</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-300" />
              <span className="text-teal-100">Flexible hours</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Open Positions
        </h2>
        <div className="space-y-4">
          {openings.map((job, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-slate-800">
                  {job.title}
                </h3>
                <div className="flex gap-2">
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                    {job.type}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                    {job.location}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                    {job.team}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{job.description}</p>
              <button
                onClick={() =>
                  alert(
                    "Application form coming soon! For now, send your resume to guidenahq@gmail.com"
                  )
                }
                className="text-sm text-teal-700 hover:text-teal-800 font-semibold"
              >
                Apply Now &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;
