
import { UserStats } from "@/services/stackingService";
import CtaSection from "@/components/shared/CtaSection";

interface ImpactSummaryProps {
  userStats: UserStats;
}

const ImpactSummary = ({ userStats }: ImpactSummaryProps) => {
  return (
    <div className="mt-8">
      <CtaSection
        title="Your Impact Summary"
        description="See how your stacking choices are making a difference in the world while earning you rewards."
        buttonText="Share Your Impact"
        buttonHref="/stacking"
        gradient="from-pink-500/10 to-orange-500/10 border-pink-500/20"
        stats={[
          { value: "8.5%", label: "Average APY Earned", color: "text-green-400" },
          { value: "30%", label: "Of Earnings Donated", color: "text-pink-400" },
          { value: userStats.supportedProjects.toString(), label: "Projects Supported", color: "text-orange-400" }
        ]}
      />
    </div>
  );
};

export default ImpactSummary;
