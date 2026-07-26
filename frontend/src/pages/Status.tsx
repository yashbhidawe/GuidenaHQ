import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const statuses = [
  {
    service: "Web Application",
    status: "operational",
    uptime: "99.98%",
    lastChecked: "2 min ago",
  },
  {
    service: "API",
    status: "operational",
    uptime: "99.95%",
    lastChecked: "2 min ago",
  },
  {
    service: "Authentication",
    status: "operational",
    uptime: "99.99%",
    lastChecked: "2 min ago",
  },
  {
    service: "Real-time Chat",
    status: "degraded",
    uptime: "98.50%",
    lastChecked: "2 min ago",
  },
  {
    service: "Video Meetings",
    status: "operational",
    uptime: "99.90%",
    lastChecked: "2 min ago",
  },
  {
    service: "Database",
    status: "operational",
    uptime: "99.99%",
    lastChecked: "2 min ago",
  },
  {
    service: "CDN / Media Storage",
    status: "operational",
    uptime: "99.97%",
    lastChecked: "2 min ago",
  },
];

const incidents = [
  {
    date: "Jul 22, 2026",
    title: "Chat service latency increase",
    status: "monitoring",
    description:
      "We observed higher than normal latency in the real-time chat service. A fix has been deployed and we are monitoring.",
  },
  {
    date: "Jul 15, 2026",
    title: "Scheduled maintenance — Database upgrade",
    status: "resolved",
    description:
      "Planned maintenance completed successfully. No data loss occurred during the upgrade.",
  },
  {
    date: "Jul 3, 2026",
    title: "Authentication service outage",
    status: "resolved",
    description:
      "Google OAuth provider experienced intermittent failures. Service was restored within 45 minutes.",
  },
];

const statusConfig = {
  operational: {
    label: "Operational",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  down: {
    label: "Down",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

const Status = () => {
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

        <h1 className="text-3xl font-bold text-slate-800 mb-2">System Status</h1>
        <p className="text-slate-500 mb-8">
          Current status of all GuidenaHQ services.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
          {statuses.map((item) => {
            const config = statusConfig[item.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;
            return (
              <div
                key={item.service}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  <span className="font-medium text-slate-800">
                    {item.service}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500 hidden sm:inline">
                    {item.uptime} uptime
                  </span>
                  <span className={`${config.color} font-medium`}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">
          Recent Incidents
        </h2>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">
                  {incident.title}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    incident.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {incident.status === "resolved" ? "Resolved" : "Monitoring"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-1">
                {incident.description}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {incident.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
