
import { configService } from "@/services/configService";
import { Project } from "@/services/projectService";
import DonationInactiveMessage from "./DonationInactiveMessage";
import DonationPercentageSlider from "./DonationPercentageSlider";
import DonationToggle from "./DonationToggle";
import ProjectManager from "./ProjectManager";
import ProjectManagerSingleProject from "./ProjectManagerSingleProject";

interface DonationSettingsProps {
  enableDonation: boolean;
  onEnableDonationChange: (enabled: boolean) => void;
  donationPercentage: number[];
  onDonationPercentageChange: (percentage: number[]) => void;
  selectedProjects: Project[];
  onSelectedProjectsChange: (projects: Project[]) => void;
  disabled?: boolean;
  stxAmount?: string;
  rewardType?: string;
}

const DonationSettings = ({
  enableDonation,
  onEnableDonationChange,
  donationPercentage,
  onDonationPercentageChange,
  selectedProjects,
  onSelectedProjectsChange,
  disabled,
  stxAmount,
  rewardType
}: DonationSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className={`space-y-4 transition-all duration-300 ${!enableDonation ? 'opacity-60' : ''}`}>
        <DonationToggle
          enableDonation={enableDonation}
          onEnableDonationChange={onEnableDonationChange}
          disabled={disabled}
        />
        {/* <div className="text-sm text-gray-400">
          Fast Pool fees are currently ~4.7%. The contribution is based on the rewards you receive.
        </div> */}

        {enableDonation ? (
          <>
            <div className="text-sm text-green-400">
              Fast Pool adds 4% on top of your contribution during cycle #115 and #116.
            </div>
            <DonationPercentageSlider
              donationPercentage={donationPercentage}
              onDonationPercentageChange={onDonationPercentageChange}
              disabled={disabled}
            />

            {configService.getMultiProjectsAllowed() ?
              <ProjectManager
                selectedProjects={selectedProjects}
                onSelectedProjectsChange={onSelectedProjectsChange}
                disabled={disabled}
                stxAmount={stxAmount}
                contributionPercentage={donationPercentage[0]}
                rewardType={rewardType}
              />
              : <ProjectManagerSingleProject
                selectedProjects={selectedProjects}
                onSelectedProjectsChange={onSelectedProjectsChange}
                disabled={disabled}
                stxAmount={stxAmount}
                contributionPercentage={donationPercentage[0]}
                rewardType={rewardType} />
            }
          </>
        ) : (
          <DonationInactiveMessage />
        )}
      </div>
    </div>
  );
};

export default DonationSettings;
