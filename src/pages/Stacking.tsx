
import { useState } from "react";
import Header from "@/components/Header";
import StackingForm from "@/components/StackingForm";
import RewardsBreakdown from "@/components/RewardsBreakdown";
import StatsDisplay from "@/components/StatsDisplay";
import { Project, projectService } from "@/services/projectService";

const Stacking = () => {
  const [stxAmount, setStxAmount] = useState("");
  const [rewardType, setRewardType] = useState<"stx" | "sbtc">("stx");
  const [enableDonation, setEnableDonation] = useState(true);
  const [donationPercentage, setDonationPercentage] = useState([4]);
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([projectService.getProjectBySlug("zero-authority-dao")]);
  const [sharePublicly, setSharePublicly] = useState(true);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
          Stack Your Way with Fast Pool
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <StackingForm
            stxAmount={stxAmount}
            setStxAmount={setStxAmount}
            rewardType={rewardType}
            setRewardType={setRewardType}
            enableDonation={enableDonation}
            donationPercentage={donationPercentage}
            selectedProjects={selectedProjects}
            sharePublicly={sharePublicly}
          />

          <RewardsBreakdown
            stxAmount={stxAmount}
            rewardType={rewardType}
            enableDonation={enableDonation}
            setEnableDonation={setEnableDonation}
            donationPercentage={donationPercentage}
            setDonationPercentage={setDonationPercentage}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            sharePublicly={sharePublicly}
            setSharePublicly={setSharePublicly}
          />
        </div>

        {false && <div className="mt-8 sm:mt-12">
          <StatsDisplay rewardType={rewardType} />
        </div>
        }
      </div>
    </div>
  );
};

export default Stacking;
