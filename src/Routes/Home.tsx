import { Button } from "@/components/ui/button";
import Container from "../components/Container";
import { Sparkles } from "lucide-react";
import { MarqueeImg } from "@/components/ui/MarqueeImg";
import Marquee from "react-fast-marquee";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <div className="relative w-full pb-24 bg-gradient-to-b from-white via-slate-50 to-purple-50">
      {/* Floating Stats */}
      <div className="absolute top-10 right-10 z-10 flex flex-col items-end space-y-3 text-right">
        {[
          { stat: "100k+", label: "Offers Landed" },
          { stat: "1.0M+", label: "Interviews Cracked" }
        ].map(({ stat, label }, i) => (
          <div key={i}>
            <p className="text-3xl font-bold text-purple-800 drop-shadow-sm">{stat}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <Container>
        <section className="mt-32 text-center md:text-left max-w-5xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text animate-pulse">
              Interview Smarter, Not Harder.
            </span>
            <span className="block text-gray-800 mt-1">
              Your Personal AI Coach for Dream Jobs.
            </span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-3xl">
            Step into interviews with unmatched clarity, confidence, and technical finesse —
            powered by real-time AI feedback and tailored practice.
          </p>

          <Link to="/generate">
            <Button className="mt-4 text-lg px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:scale-105 transition-transform text-white shadow-md">
              Get Started <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        {/* Hero Image */}
        <div className="relative w-full mt-12 overflow-hidden rounded-2xl bg-white/30 backdrop-blur-md shadow-xl h-[420px] border border-gray-200">
          <img
            src="/assets/img/human-vs-robot-job-interview-modern-workplace_159311-2154.webp"
            alt="Human vs AI interview"
            className="w-full h-full object-cover opacity-90"
          />

          {/* Badge top-left */}
          <div className="absolute top-4 left-4 bg-white/80 text-gray-800 text-sm font-semibold px-3 py-1 rounded shadow">
            🧠 AI Interview Copilot
          </div>

          {/* Developer Card */}
          <div className="hidden md:block absolute bottom-6 right-6 w-80 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg border">
            <h2 className="text-lg font-semibold text-gray-800">Built for Developers</h2>
            <p className="text-sm text-gray-600 mt-1">
              Simulate real-world interviews. Train smarter. Level up faster.
            </p>
            <Button className="mt-4 w-full bg-purple-700 hover:bg-purple-800 text-white">
              Try Now <Sparkles className="ml-2" />
            </Button>
          </div>
        </div>
      </Container>

      {/* Tech Logos - Marquee */}
      <div className="w-full my-16">
        <Marquee pauseOnHover speed={50} gradient={false}>
          {[
            "firebase", "meet", "zoom", "firebase",
            "microsoft", "meet", "tailwindcss", "microsoft"
          ].map((logo, i) => (
            <MarqueeImg key={i} img={`/assets/img/logo/${logo}.png`} />
          ))}
        </Marquee>
      </div>

      {/* Secondary Section */}
      <Container className="py-14 space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 leading-snug">
          Unlock Tailored Insights and AI-Driven Interview Mastery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
          {/* Image */}
          <div className="col-span-1 md:col-span-3">
            <img
              src="/assets/img/office.jpg"
              alt="Interview setup"
              className="w-full h-full max-h-96 rounded-lg object-cover shadow-lg"
            />
          </div>

          {/* CTA Text */}
          <div className="col-span-1 md:col-span-2 text-center flex flex-col justify-center items-center gap-6">
            <p className="text-gray-600 text-lg">
              Let go of guesswork. Practice behavioral and technical interviews with
              intelligent prompts and coaching. Get actionable feedback and land your dream role.
            </p>
            <Link to="/generate" className="w-full flex justify-center">
              <Button className="w-3/4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow hover:scale-105 transition-transform">
                Start Practicing <Sparkles className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
