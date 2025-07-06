
import { useState } from "react";
import Header from "@/components/Header";
import StackingForm from "@/components/StackingForm";
import RewardsBreakdown from "@/components/RewardsBreakdown";
import StatsDisplay from "@/components/StatsDisplay";
import { Project } from "@/services/projectService";

const Stacking = () => {
  const [stxAmount, setStxAmount] = useState("");
  const [rewardType, setRewardType] = useState<"stx" | "sbtc">("stx");
  const [enableDonation, setEnableDonation] = useState(true);
  const [donationPercentage, setDonationPercentage] = useState([10]); // Changed to 4.7% minimum
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
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

        {/* Show selected projects with contribution details */}
        {selectedProjects.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Your Project Contributions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedProjects.map((project) => {
                // Calculate contribution for each project
                const estimatedYield = stxAmount ? (parseFloat(stxAmount) * 0.085) : 0;
                const totalContribution = enableDonation ? (estimatedYield * donationPercentage[0]) / 100 : 0;
                
                let projectContribution = { percentage: 0, amount: "0" };
                
                if (project.name === "Fast Pool") {
                  const fastPoolPercentage = 4.7;
                  const fastPoolAmount = (estimatedYield * fastPoolPercentage) / 100;
                  projectContribution = { percentage: fastPoolPercentage, amount: fastPoolAmount.toFixed(4) };
                } else {
                  const otherProjects = selectedProjects.filter(p => p.name !== "Fast Pool");
                  const remainingPercentage = donationPercentage[0] - 4.7;
                  const percentagePerProject = otherProjects.length > 0 ? remainingPercentage / otherProjects.length : 0;
                  const amountPerProject = (estimatedYield * percentagePerProject) / 100;
                  projectContribution = { percentage: percentagePerProject, amount: amountPerProject.toFixed(4) };
                }
                
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    contributionPercentage={projectContribution.percentage}
                    estimatedContribution={projectContribution.amount}
                    rewardType={rewardType}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-12">
          <StatsDisplay rewardType={rewardType} />
        </div>
      </div>
    </div>
  );
};

export default Stacking;
