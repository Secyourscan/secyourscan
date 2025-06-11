import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shield,
  Eye,
  Bell,
  Lock,
  BarChart3,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Database,
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMetrics } from "@/hooks/useMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { data: metrics, isLoading, error } = useMetrics();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://avatars.githubusercontent.com/u/180004145?s=200&v=4"
                alt="SecYourScan Logo"
                className="h-10 w-10 rounded-lg"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SecYourScan
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#dashboard"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#about"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                About
              </a>
              <a
                href="#services"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                Services
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                Contact
              </a>
            </div>
            <Link to="/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Stay vigilant and protect your personal information from data
            breaches.
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Check if Your Email Address Has Been Compromised
          </p>
          <Link to="/scan">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
            >
              Start Scanning Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Global Threat Landscape
            </h3>
            <p className="text-slate-300 text-lg">
              Real-time statistics from our comprehensive breach monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                    <Database className="h-8 w-8 text-purple-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-12 w-24 mb-2 bg-slate-700" />
                ) : error ? (
                  <div className="text-red-400 text-xl font-bold">Error</div>
                ) : (
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {metrics?.breaches || "624"}
                  </div>
                )}
                <div className="text-slate-300 font-medium">Data Breaches</div>
                <div className="text-sm text-slate-400 mt-1">
                  Monitored incidents
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-red-400" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-12 w-24 mb-2 bg-slate-700" />
                ) : error ? (
                  <div className="text-red-400 text-xl font-bold">Error</div>
                ) : (
                  <div className="text-4xl font-bold text-red-400 mb-2">
                    {metrics?.exposedRecords || "10.4B"}
                  </div>
                )}
                <div className="text-slate-300 font-medium">
                  Exposed Records
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Compromised data points
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-12 w-24 mb-2 bg-slate-700" />
                ) : error ? (
                  <div className="text-red-400 text-xl font-bold">Error</div>
                ) : (
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {metrics?.exposedEmails || "4.7B"}
                  </div>
                )}
                <div className="text-slate-300 font-medium">Exposed Emails</div>
                <div className="text-sm text-slate-400 mt-1">
                  Breached email addresses
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-600/20 rounded-lg group-hover:bg-orange-600/30 transition-colors">
                    <Key className="h-8 w-8 text-orange-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-12 w-24 mb-2 bg-slate-700" />
                ) : error ? (
                  <div className="text-red-400 text-xl font-bold">Error</div>
                ) : (
                  <div className="text-4xl font-bold text-orange-400 mb-2">
                    {metrics?.exposedPasswords || "836.0M"}
                  </div>
                )}
                <div className="text-slate-300 font-medium">
                  Exposed Passwords
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Compromised credentials
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">
                  Breaches Visualization
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Quickly view and analyze your data breaches to understand
                  their impact and take immediate action.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Bell className="h-12 w-12 text-red-400 mb-4" />
                <CardTitle className="text-white">
                  Exposed Data Breaches
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Get notified when your data is exposed in recent breaches and
                  stay protected with real-time alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Lock className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Privacy Shield</CardTitle>
                <CardDescription className="text-slate-400">
                  Strengthen your privacy by securing your accounts and
                  monitoring for threats in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="container mx-auto px-4 py-16 bg-slate-800/30"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            About Us
          </h3>
          <p className="text-lg text-slate-300 text-center mb-12 max-w-4xl mx-auto">
            We are committed to safeguarding your digital footprint. Our
            platform offers advanced breach detection and password protection
            services, designed to ensure that your sensitive information remains
            secure. We strive to bring you peace of mind by proactively
            monitoring and alerting you to potential threats.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Eye className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">
                Comprehensive Breach Monitoring
              </h4>
              <p className="text-slate-400">
                SecYourScan provides real-time data breach scans, giving you
                insights into compromised credentials across the web.
              </p>
            </div>

            <div className="text-center">
              <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">
                Secure and User-Friendly Platform
              </h4>
              <p className="text-slate-400">
                Our platform is built for ease of use, with robust encryption
                protocols to ensure your data is always protected.
              </p>
            </div>

            <div className="text-center">
              <Bell className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">
                Real-Time Alerts and Reports
              </h4>
              <p className="text-slate-400">
                Receive instant notifications and detailed reports whenever your
                credentials are found in a data breach, helping you take
                immediate action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-4">
            Pricing
          </h3>
          <p className="text-slate-300 text-center mb-12">
            Choose a plan that suits your needs!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">
                  Basic Plan
                </CardTitle>
                <div className="text-3xl font-bold text-purple-400">
                  $29 <span className="text-lg text-slate-400">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Core dark web scanning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Monitor up to 5 sources
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Receive daily reports and email alerts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Custom Integration & Full Dashboard Access
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 border-purple-500">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-purple-600">Most Popular</Badge>
                <CardTitle className="text-white text-2xl">
                  Business Plan
                </CardTitle>
                <div className="text-3xl font-bold text-purple-400">
                  $49 <span className="text-lg text-slate-400">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Core dark web scanning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Monitor up to 10 sources
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Receive daily reports and email alerts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Custom Integration & Full Dashboard Access
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">
                  Developer Plan
                </CardTitle>
                <div className="text-3xl font-bold text-purple-400">
                  $99 <span className="text-lg text-slate-400">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Core dark web scanning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Unlimited monitoring sources
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Receive daily reports and email alerts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">
                      Custom Integration (Developer api) & Full Dashboard Access
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-slate-800/50 border-t border-slate-700"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://avatars.githubusercontent.com/u/180004145?s=200&v=4"
                  alt="SecYourScan Logo"
                  className="h-8 w-8 rounded-lg"
                />
                <h4 className="text-xl font-bold text-white">SecYourScan</h4>
              </div>
              <p className="text-slate-400">
                Secyourscan helps you stay vigilant and protect your personal
                information from data breaches. We provide tools to check if
                your email address has been compromised.
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Useful Links</h5>
              <div className="space-y-2">
                <a
                  href="/"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Breaches Visualization
                </a>
                <a
                  href="#"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Data Breaches Timeline
                </a>
                <a
                  href="/exposed-breach"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Exposed Data Breaches
                </a>
                <a
                  href="#"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Password-Pwned ?
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Our Services</h5>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Secyourall SIEM
                </a>
                <a
                  href="#"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Secyourflow SOAR
                </a>
                <a
                  href="#"
                  className="block text-slate-400 hover:text-purple-400 transition-colors"
                >
                  Secyourscan
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Contact Us</h5>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                  <div className="text-slate-400">
                    <div>Sheyne Inc</div>
                    <div>Bhaktithapa, Baneshwor</div>
                    <div>Nepal</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-400">+977 9828137850</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-400">info@shyena.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 Shyena Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
