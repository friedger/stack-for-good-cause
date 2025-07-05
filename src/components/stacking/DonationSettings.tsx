
import { Project } from "@/services/projectService";
import ProjectManager from "./ProjectManager";
import DonationToggle from "./DonationToggle";
import DonationPercentageSlider from "./DonationPercentageSlider";
import PublicSharingToggle from "./PublicSharingToggle";
import DonationInactiveMessage from "./DonationInactiveMessage";
import RewardDistribution from "./RewardDistribution";

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
  disabled
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
            />

            {/* <PublicSharingToggle
              sharePublicly={sharePublicly}
              onSharePubliclyChange={onSharePubliclyChange}
              disabled={disabled}
            /> */}
          </>
        ) : (
          <DonationInactiveMessage />
        )}
      </div>

      {/* Show reward distribution when donation is enabled and projects are selected */}
      {enableDonation && selectedProjects.length > 0 && (
        <RewardDistribution
          selectedProjects={selectedProjects}
          donationPercentage={donationPercentage[0]}
          enableDonation={enableDonation}
        />
      )}
    </div>
  );
};

export default DonationSettings;
