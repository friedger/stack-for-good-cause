
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, TrendingUp, Zap } from "lucide-react";
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
            Stack<span className="text-orange-400">Give</span>
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
            Stack STX,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              Give Back
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Earn stacking rewards on the Stacks blockchain while supporting meaningful projects. 
            Choose how much of your yield to donate and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/app">
                Start Stacking <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </PrimaryButton>
            <SecondaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/projects">Browse Projects</Link>
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Why Choose StackGive?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Shield className="h-12 w-12 text-orange-400 mb-4" />
              <CardTitle className="text-xl">Secure Stacking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Stack your STX securely using Fast Pool technology with proven smart contracts 
                and transparent operations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-400 mb-4" />
              <CardTitle className="text-xl">Give Back</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Choose how much of your stacking yield to donate to projects you care about. 
                Make a positive impact while earning.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-xl">Maximize Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Earn competitive stacking yields while supporting meaningful causes. 
                Your investment grows while making a difference.
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
            <div className="text-gray-200 font-medium">Donated to Projects</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">150+</div>
            <div className="text-gray-200 font-medium">Active Stackers</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Card className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="py-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Stack and Give?
            </h3>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto font-medium">
              Join our community of stackers who believe in earning rewards while making a positive impact. 
              Start your journey today.
            </p>
            <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/app">
                Launch App <Zap className="ml-2 h-5 w-5" />
              </Link>
            </PrimaryButton>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div className="text-lg font-bold mb-4 md:mb-0">
            Stack<span className="text-orange-400">Give</span>
          </div>
          <div className="text-sm">
            © 2024 StackGive. Built on Stacks blockchain.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
