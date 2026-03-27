import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Timer,
  BrainCircuit,
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Overall Attendance",
    value: "78%",
    change: "+2%",
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "warning" as const,
  },
  {
    title: "Pending Assignments",
    value: "4",
    change: "2 due soon",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    badge: "warning" as const,
  },
  {
    title: "Study Hours (Week)",
    value: "14h",
    change: "+3h vs last week",
    icon: Timer,
    color: "text-green-600",
    bg: "bg-green-50",
    badge: "success" as const,
  },
  {
    title: "Current Streak",
    value: "7 days",
    change: "Personal best!",
    icon: Flame,
    color: "text-red-500",
    bg: "bg-red-50",
    badge: "success" as const,
  },
];

const recentActivity = [
  {
    action: "Completed Assignment",
    subject: "Data Structures",
    time: "2 hours ago",
  },
  {
    action: "AI Tutor Session",
    subject: "Machine Learning",
    time: "5 hours ago",
  },
  {
    action: "Study Session (2h)",
    subject: "Algorithms",
    time: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Good morning, Student! 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Here&apos;s your academic overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-blue-100">
          <Trophy size={18} className="text-yellow-500" />
          <span className="text-sm font-semibold text-gray-700">
            Level 5 · 1250 XP
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bg} p-2.5 rounded-xl`}>
                    <Icon size={20} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit size={18} className="text-blue-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100">
              <TrendingUp size={16} className="text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Attendance Risk in Physics
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your attendance is at 68%. You need 6 more classes to reach 75%.
                </p>
              </div>
              <Badge variant="warning">Warning</Badge>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Strong performance in DSA
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  You&apos;ve consistently scored above 85% in assignments.
                </p>
              </div>
              <Badge variant="success">Great</Badge>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <BrainCircuit size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Recommended: Review Machine Learning fundamentals
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Based on your recent AI tutor sessions, brushing up on basics will help.
                </p>
              </div>
              <Badge variant="secondary">Tip</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer size={18} className="text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex flex-col gap-0.5 p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <p className="text-sm font-medium text-gray-800">
                  {activity.action}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {activity.subject}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
