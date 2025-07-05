
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, TrendingUp, Zap, Share2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            Fast<span className="text-orange-400">Pool</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/app" className="text-white hover:text-orange-400 transition-colors">
              App
            </Link>
            <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
              Projects
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
            <PrimaryButton asChild>
              <Link to="/app">Get Started</Link>
            </PrimaryButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Stack Your Way,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              Earn Your Rewards
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience fast, flexible stacking with choice over your rewards. Earn in STX or sBTC, 
            choose your impact, and join a community making a difference together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/app">
                Start Stacking <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </PrimaryButton>
            <SecondaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/projects">Explore Impact</Link>
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Why Choose Fast Pool?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Shield className="h-12 w-12 text-orange-400 mb-4" />
              <CardTitle className="text-xl">Your Choice, Your Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Choose to receive your stacking rewards in STX or sBTC. Fast Pool technology 
                with no lock-up periods and daily distributions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-400 mb-4" />
              <CardTitle className="text-xl">Optional Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Decide if and how much you want to donate to meaningful projects. 
                Your stacking, your choice, your impact.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Share2 className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-xl">Share Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Join a community of stackers sharing their contributions. 
                Celebrate good deeds and inspire others to make a difference.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="container mx-auto px-6 py-20">
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
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-xl">Community Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                See real-time contributions from the community. Track collective impact 
                and celebrate milestones together as we support meaningful causes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Share2 className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-xl">Social Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Share your contributions on social media with beautiful impact cards. 
                Inspire your network and grow the movement of crypto for good.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-orange-400 mb-2">$2.5M+</div>
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
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Card className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="py-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Stack Your Way?
            </h3>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto font-medium">
              Join Fast Pool today and experience stacking on your terms. Choose your rewards, 
              decide your impact, and be part of a community doing good together.
            </p>
            <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/app">
                Launch Fast Pool <Zap className="ml-2 h-5 w-5" />
              </Link>
            </PrimaryButton>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div className="text-lg font-bold mb-4 md:mb-0">
            Fast<span className="text-orange-400">Pool</span>
          </div>
          <div className="text-sm">
            © 2024 Fast Pool. Built on Stacks blockchain.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
