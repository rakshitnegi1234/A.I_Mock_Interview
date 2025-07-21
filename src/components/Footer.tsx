import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import { MainRoutes } from "@/lib/helper";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "transition-all duration-300 text-gray-400 hover:scale-110",
      hoverColor
    )}
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1"
    >
      {children}
    </Link>
  </li>
);

interface FooterLinkGroupProps {
  title: string;
  links: { to: string; label: string }[];
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <FooterLink key={link.to} to={link.to}>
          {link.label}
        </FooterLink>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const serviceLinks = [
    { to: "/services/interview-prep", label: "Interview Preparation" },
    { to: "/services/career-coaching", label: "Career Coaching" },
    { to: "/services/resume-building", label: "Resume Building" },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-black via-zinc-900 to-gray-900 text-gray-400 py-14 mt-20 border-t border-gray-800">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        <FooterLinkGroup
  title="Quick Links"
  links={MainRoutes.map((route) => ({
    label: route.label,
    to: route.href, // ✅ Map href → to
  }))}
/>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We’re dedicated to helping you grow with AI-driven tools.
              From mock interviews to resume insights — we help you stand out.
            </p>
          </div>
          <FooterLinkGroup title="Services" links={serviceLinks} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <p className="text-sm mb-4">123 AI Street, Tech City, 12345</p>
            <div className="flex gap-4">
              <SocialLink
                href="https://facebook.com"
                icon={<Facebook size={22} />}
                hoverColor="hover:text-blue-500"
              />
              <SocialLink
                href="https://twitter.com"
                icon={<Twitter size={22} />}
                hoverColor="hover:text-blue-400"
              />
              <SocialLink
                href="https://instagram.com"
                icon={<Instagram size={22} />}
                hoverColor="hover:text-pink-500"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={<Linkedin size={22} />}
                hoverColor="hover:text-blue-700"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} AI Mock Interview. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
