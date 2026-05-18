import { motion } from "framer-motion";
import { ArrowRight, ChartNoAxesCombined, Clock3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Logo from "../components/common/Logo";

const features = [
  {
    icon: Clock3,
    title: "Pomodoro sessions that stay honest",
    description: "Pick 25, 50, or 90 minutes and commit publicly to one clear task.",
  },
  {
    icon: Users,
    title: "Presence instead of noise",
    description: "See who is actively focusing right now without chat, calls, or social clutter.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Progress you can feel",
    description: "Track streaks, weekly focus hours, and the quiet momentum behind your work.",
  },
];

const LandingPage = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="glass-panel flex flex-col gap-5 rounded-[30px] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to={token ? "/room" : "/register"}>
              <Button className="flex items-center gap-2">
                Enter FocusRoom
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]"
        >
          <Card className="overflow-hidden p-8 sm:p-10">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-line bg-plateMint px-4 py-2 text-xs uppercase tracking-[0.26em] text-ink">
                Silent online library for deep work
              </p>
              <h1 className="mt-8 font-display text-5xl font-semibold tracking-tight text-ink sm:text-7xl">
                Being seen working is enough.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                FocusRoom is a real-time virtual co-working Pomodoro app where the room itself keeps
                you accountable. No chat. No video. Just live presence, clean timers, and visible progress.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to={token ? "/room" : "/register"}>
                  <Button className="flex items-center gap-2">
                    Start a focus session
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">I already have an account</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-muted">How it works</p>
            <div className="mt-6 space-y-4">
              {[
                "Pick one task and one Pomodoro length.",
                "Enter the room and appear live to everyone else focusing.",
                "Finish the block, log the completion, and build a streak.",
              ].map((step, index) => (
                <div key={step} className="rounded-3xl border border-line bg-plateBlue p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Step 0{index + 1}</p>
                  <p className="mt-2 text-sm leading-7 text-ink">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-platePeach text-ink">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 font-display text-2xl text-ink">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{feature.description}</p>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
