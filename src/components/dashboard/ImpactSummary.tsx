
import { useState, useEffect } from "react";
import { stackingStatsService, type StackingStats } from "@/services/stackingStatsService";
import CtaSection from "@/components/shared/CtaSection";

const ImpactSummary = () => {
  const [stackingStats, setStackingStats] = useState<StackingStats>({
    currentlyStacked: 0,
    totalEarned: 0,
    totalDonated: 0,
    activeStacks: 0,
    supportedProjects: 0,
    apr: 8.5
  });

  useEffect(() => {
    const updateStats = () => {
      setStackingStats(stackingStatsService.getCurrentStats());
    };

    updateStats();
    // Update stats every 5 seconds to reflect changes
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const donationPercentage = stackingStats.totalEarned > 0 
    ? ((stackingStats.totalDonated / stackingStats.totalEarned) * 100).toFixed(0)
    : "0";

  return (
    <div className="mt-6 sm:mt-8">
      <CtaSection
        title="Your Impact Summary"
        description="See how your stacking choices are making a difference in the world while earning you rewards."
        buttonText="Share Your Impact"
        buttonHref="/stacking"
        gradient="from-pink-500/10 to-orange-500/10 border-pink-500/20"
        stats={[
          { value: `${stackingStats.apr}%`, label: "Average APY Earned", color: "text-green-400" },
          { value: `${donationPercentage}%`, label: "Of Earnings Donated", color: "text-pink-400" },
          { value: stackingStats.supportedProjects.toString(), label: "Projects Supported", color: "text-orange-400" }
        ]}
      />
    </div>
  );
};

export default ImpactSummary;
