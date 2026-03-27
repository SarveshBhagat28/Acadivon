import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, MessageSquare, BarChart3, Calendar } from "lucide-react";
import Link from "next/link";

const aiModules = [
  {
    title: "AI Tutor",
    description:
      "Get personalized explanations for any concept. Adaptive to your level — beginner or advanced.",
    icon: MessageSquare,
    href: "/ai-hub/tutor",
    badge: "Core",
    badgeVariant: "default" as const,
    color: "from-blue-500 to-blue-700",
    features: ["Concept explanations", "Code help", "Example generation", "Practice problems"],
  },
  {
    title: "AI Analyzer",
    description:
      "Analyze your academic performance, attendance patterns, and study habits to identify weak areas.",
    icon: BarChart3,
    href: "/ai-hub/analyzer",
    badge: "Intelligence",
    badgeVariant: "secondary" as const,
    color: "from-purple-500 to-purple-700",
    features: ["Weak subject detection", "Habit analysis", "Performance trends", "Risk alerts"],
  },
  {
    title: "AI Planner",
    description:
      "Generate intelligent daily and weekly study schedules tailored to your timetable and goals.",
    icon: Calendar,
    href: "/ai-hub/planner",
    badge: "Action",
    badgeVariant: "success" as const,
    color: "from-green-500 to-green-700",
    features: ["Daily schedules", "Weekly plans", "Auto-adjustment", "Revision cycles"],
  },
];

export default function AIHubPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BrainCircuit className="text-blue-600" size={24} />
          AI Hub
        </h2>
        <p className="text-gray-500 mt-1">
          Your intelligent academic assistant. Powered by GPT-4.
        </p>
      </div>

      {/* AI Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <Badge variant={module.badgeVariant}>{module.badge}</Badge>
                </div>
                <CardTitle className="text-lg mt-3">{module.title}</CardTitle>
                <p className="text-sm text-gray-500">{module.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5">
                  {module.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={module.href}>
                  <Button className="w-full">Launch {module.title}</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Flow diagram */}
      <Card>
        <CardHeader>
          <CardTitle>How AI Works Together</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { label: "You Ask Tutor", color: "bg-blue-100 text-blue-800" },
              { label: "→", color: "" },
              { label: "Interaction Stored", color: "bg-gray-100 text-gray-700" },
              { label: "→", color: "" },
              { label: "Analyzer Processes", color: "bg-purple-100 text-purple-800" },
              { label: "→", color: "" },
              { label: "Planner Updates Schedule", color: "bg-green-100 text-green-800" },
            ].map((item, index) =>
              item.label === "→" ? (
                <span key={index} className="text-gray-400 font-bold">
                  →
                </span>
              ) : (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${item.color}`}
                >
                  {item.label}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
