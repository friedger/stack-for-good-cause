
import CtaSection from "@/components/shared/CtaSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { configService } from "@/services/configService";
import { ArrowRight, Heart, Share2, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const statsEnabled = false; // enabled when backend is ready

const Index = () => {
  const multiProjectsAllowed = configService.getMultiProjectsAllowed();
  const subHeading = configService.getSubHeading()
  return (
    <>

      {/* Hero Section */}
      < section className="container mx-auto px-6 py-20 text-center" >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Stack with Purpose,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Shared Impact
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {subHeading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/stacking">
                Start Stacking <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </PrimaryButton>
            {multiProjectsAllowed && (
              <SecondaryButton asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/projects">Explore Impact</Link>
              </SecondaryButton>
            )}
          </div>
        </div>
      </section >

      {/* Features Section */}
      < section className="container mx-auto px-6 py-20" >
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Why Choose Fast Pool?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-xl text-white">Your Choice, Your Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Choose to receive your stacking rewards in STX or sBTC. Fast Pool technology
                with transparency and minimized trust.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-400 mb-4" />
              <CardTitle className="text-xl text-white">Optional Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Decide if and how much you want to donate to meaningful projects.
                Your yield, your choice, your impact.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Share2 className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-xl text-white">Share Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Join a community of stackers sharing their contributions.
                Celebrate good deeds and inspire others to make a difference.
              </p>
            </CardContent>
          </Card>
        </div>
      </section >

      {/* Social Impact Section */}
      < section className="container mx-auto px-6 py-20" >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stack Together, Impact Together
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            When you choose to donate, you join a visible community of contributors.
            Share your impact, inspire others, and be part of something bigger.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-xl text-white">Community Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                See real-time contributions from the community. Track collective impact
                and celebrate milestones together as we support meaningful causes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Share2 className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-xl text-white">Social Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Share your contributions on Nostr.
                Inspire your network and grow the movement of crypto for good.
              </p>
            </CardContent>
          </Card>
        </div>
      </section >

      {/* Stats Section */}
      {statsEnabled &&
        < section className="container mx-auto px-6 py-20" >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">$2.5M+</div>
              <div className="text-gray-200 font-medium">Total Value Stacked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">$125K+</div>
              <div className="text-gray-200 font-medium">Community Donations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">150+</div>
              <div className="text-gray-200 font-medium">Active Community Members</div>
            </div>
          </div>
        </section >
      }

      {/* CTA Section */}
      < section className="container mx-auto px-6 py-20 text-center" >
        <CtaSection
          title="Ready to Stack Your Way?"
          description="Join Fast Pool today and experience stacking on your terms. Choose your rewards, decide your impact, and be part of a community doing good together."
          buttonText="Start Stacking"
          buttonHref="/stacking"
          buttonIcon={<ArrowRight className="ml-2 h-5 w-5" />}
        />
      </section >

    </>
  );
};

export default Index;
