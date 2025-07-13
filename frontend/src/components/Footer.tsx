import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Calendar,
  BookOpen,
  Brain,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: "Feed", path: "/", icon: Heart },
    { name: "Requests", path: "/requests", icon: Users },
    { name: "Meetings", path: "/meetings", icon: Calendar },
    { name: "Mentorships", path: "/mentorships", icon: BookOpen },
    { name: "Guidena AI", path: "/guidena-ai", icon: Brain },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/itsokyash_" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/itsokyash/",
    },
    { name: "GitHub", icon: Github, href: "https://github.com/yashbhidawe" },
    { name: "Email", icon: Mail, href: "mailto:guidenahq@gmail.com" },
  ];

  return (
    <footer className="bg-[#0f4c4c] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="">
                  <img
                    src="/Logo.png"
                    alt="Guidena Logo"
                    className="h-28 filter brightness-0 invert object-cover"
                  />
                </div>
              </div>
              <p className="text-[#b3d9d9] text-sm leading-relaxed">
                Connecting minds, fostering growth, and building meaningful
                relationships through mentorship and collaboration.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#f5f5f0]">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="flex items-center space-x-2 text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200 text-sm"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#f5f5f0]">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200 text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200 text-sm"
                  >
                    Community Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200 text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200 text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200 text-sm"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#f5f5f0]">Connect</h3>
              <p className="text-[#b3d9d9] text-sm">
                Follow us on social media for updates and community highlights.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-9 h-9 bg-[#2d6a6a] rounded-lg flex items-center justify-center text-[#b3d9d9] hover:bg-[#5fb3b3] hover:text-white transition-all duration-200 transform hover:scale-105"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#2d6a6a] py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[#b3d9d9] text-sm">
              © {currentYear} Guidena. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#"
                className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200"
              >
                Status
              </a>
              <a
                href="#"
                className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200"
              >
                API
              </a>
              <a
                href="#"
                className="text-[#b3d9d9] hover:text-[#5fb3b3] transition-colors duration-200"
              >
                Careers
              </a>
              <div className="flex items-center space-x-1 text-[#b3d9d9]">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>for mentorship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
