import React, { useEffect, useState } from "react";
import { Trophy, CheckCircle, XCircle, Clock, User } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";
import { LoadingState, EmptyState } from "../components/ui/States";
import { Stagger, StaggerItem } from "../components/ui/Reveal";

export default function AdminAchievements() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://web-portal-760h.onrender.com/api/achievements/pending")
      .then(res => res.json())
      .then(data => setPending(data))
      .finally(() => setLoading(false));
  }, []);

  const approveAchievement = async (id) => {
    const res = await fetch(
      `https://web-portal-760h.onrender.com/api/achievements/${id}/approve`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: "admin-demo" })
      }
    );

    if (!res.ok) {
      alert("Approve failed");
      return;
    }

    setPending(prev => prev.filter(a => a._id !== id));
  };

  const rejectAchievement = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (!reason) return;

    const res = await fetch(
      `https://web-portal-760h.onrender.com/api/achievements/${id}/reject`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: "admin-demo", reason })
      }
    );

    if (!res.ok) {
      alert("Reject failed");
      return;
    }

    setPending(prev => prev.filter(a => a._id !== id));
  };

  if (loading) {
    return <LoadingState label="Loading achievements" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        compact
        eyebrow="Review queue"
        title="Manage Achievements"
        description="Review and approve pending achievement submissions"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SpotlightCard variant="gradient">
          <div className="flex items-center gap-4 p-5">
            <span className="icon-tile h-10 w-10">
              <Clock className="h-[18px] w-[18px] text-amber-300" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[13px] text-fg-muted">Pending Review</p>
              <p className="text-2xl font-semibold tabular-nums text-fg">{pending.length}</p>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Content */}
      {pending.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Pending Achievements"
          description="All achievement submissions have been reviewed."
        />
      ) : (
        <Stagger className="space-y-3">
          {pending.map(achievement => (
            <StaggerItem key={achievement._id} className="surface p-5 transition-colors hover:border-line-hover sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-[16px] font-semibold tracking-tight text-fg">{achievement.title}</h3>
                  <p className="mb-4 text-[14px] leading-relaxed text-fg/80">{achievement.description}</p>

                  <div className="flex items-center gap-3 text-[13px] text-fg-muted">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span className="text-fg/90">{achievement.userId.fullName}</span>
                    </div>
                    <span className="text-fg-muted/50">•</span>
                    <span>{achievement.userId.year} Year</span>
                  </div>
                </div>

                <div className="flex flex-none gap-2 sm:ml-4">
                  <button onClick={() => approveAchievement(achievement._id)} className="btn-success btn-sm">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button onClick={() => rejectAchievement(achievement._id)} className="btn-danger btn-sm">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
