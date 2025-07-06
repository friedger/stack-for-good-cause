
import { Project } from "@/services/projectService";
import ProjectManager from "./ProjectManager";
import DonationToggle from "./DonationToggle";
import DonationPercentageSlider from "./DonationPercentageSlider";
import PublicSharingToggle from "./PublicSharingToggle";
import DonationInactiveMessage from "./DonationInactiveMessage";

interface DonationSettingsProps {
  enableDonation: boolean;
  onEnableDonationChange: (enabled: boolean) => void;
  donationPercentage: number[];
  onDonationPercentageChange: (percentage: number[]) => void;
  selectedProjects: Project[];
  onSelectedProjectsChange: (projects: Project[]) => void;
  sharePublicly: boolean;
  onSharePubliclyChange: (share: boolean) => void;
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
  sharePublicly,
  onSharePubliclyChange,
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

        {enableDonation ? (
          <>
            <DonationPercentageSlider
              donationPercentage={donationPercentage}
              onDonationPercentageChange={onDonationPercentageChange}
              disabled={disabled}
            />

            <ProjectManager
              selectedProjects={selectedProjects}
              onSelectedProjectsChange={onSelectedProjectsChange}
              disabled={disabled}
              stxAmount={stxAmount}
              contributionPercentage={donationPercentage[0]}
              rewardType={rewardType}
            />
          </>
        ) : (
          <DonationInactiveMessage />
        )}
      </div>
    </div>
  );
};

export default DonationSettings;
