
import { Card, CardContent } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ReactNode } from "react";

interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: ReactNode;
  gradient?: string;
  stats?: Array<{
    value: string;
    label: string;
    color: string;
  }>;
}

const CtaSection = ({ 
  title, 
  description, 
  buttonText, 
  buttonHref, 
  buttonIcon,
  gradient = "from-orange-500/20 to-pink-500/20 border-orange-500/30",
  stats 
}: CtaSectionProps) => {
  return (
    <Card className={`bg-gradient-to-r ${gradient} backdrop-blur-sm`}>
      <CardContent className="py-16">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            {title}
          </h3>
          <p className="text-gray-100 mb-8 max-w-2xl mx-auto font-medium">
            {description}
          </p>
          
          {stats && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          
          <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
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
