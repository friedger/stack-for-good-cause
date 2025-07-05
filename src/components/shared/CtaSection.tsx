
import { Card, CardContent } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ReactNode } from "react";

interface StatItem {
  value: string;
  label: string;
  color: string;
}

interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: ReactNode;
  gradient?: string;
  stats?: StatItem[];
}

const DEFAULT_GRADIENT = "from-blue-900/90 to-purple-900/90 border-blue-500/30";

const StatDisplay = ({ stat }: { stat: StatItem }) => (
  <div className="text-center">
    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-2`}>
      {stat.value}
    </div>
    <div className="text-gray-200 text-sm sm:text-base">
      {stat.label}
    </div>
  </div>
);

const StatsGrid = ({ stats }: { stats: StatItem[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
    {stats.map((stat, index) => (
      <StatDisplay key={index} stat={stat} />
    ))}
  </div>
);

const CtaSection = ({
  title,
  description,
  buttonText,
  buttonHref,
  buttonIcon,
  gradient = DEFAULT_GRADIENT,
  stats
}: CtaSectionProps) => {
  return (
    <Card className={`bg-gradient-to-r ${gradient} backdrop-blur-sm`}>
      <CardContent className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {title}
          </h3>

          <p className="text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto font-medium text-sm sm:text-base">
            {description}
          </p>

          {stats && <StatsGrid stats={stats} />}

          <PrimaryButton asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
            <a href={buttonHref}>
              {buttonText} {buttonIcon}
            </a>
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default CtaSection;
