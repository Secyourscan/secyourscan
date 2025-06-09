import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Shield,
  Mail,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Database,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [activeTab, setActiveTab] = useState("email");

  // Email breach check query
  const {
    data: emailBreachData,
    isLoading: emailLoading,
    error: emailError,
    refetch: refetchEmail,
  } = useQuery({
    queryKey: ["email-breach", email],
    queryFn: async () => {
      const response = await fetch(
        `https://secyourscan.aryan4.com.np/v1/check-email?email=${email}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(
            `Rate limit exceeded. Please try again in ${Math.ceil(
              errorData.retry_after / 60
            )} minutes.`
          );
        }
        throw new Error("Failed to check email");
      }

      const data = await response.json();
      console.log("Email breach data:", data);
      return data;
    },
    enabled: false,
  });

  // Email analytics query
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["email-analytics", email],
    queryFn: async () => {
      const response = await fetch(
        `https://secyourscan.aryan4.com.np/v1/breach-analytics?email=${email}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(
            `Rate limit exceeded. Please try again in ${Math.ceil(
              errorData.retry_after / 60
            )} minutes.`
          );
        }
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      console.log("Analytics data:", data);
      return data;
    },
    enabled: false,
  });

  // Domain breach query
  const {
    data: domainBreachData,
    isLoading: domainLoading,
    error: domainError,
    refetch: refetchDomain,
  } = useQuery({
    queryKey: ["domain-breach", domain],
    queryFn: async () => {
      const response = await fetch(
        `https://secyourscan.aryan4.com.np/v1/domain-breaches-summary?domain=${domain}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(
            `Rate limit exceeded. Please try again in ${Math.ceil(
              errorData.retry_after / 60
            )} minutes.`
          );
        }
        if (response.status === 404) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || "Invalid domain or no data found"
          );
        }
        throw new Error("Failed to check domain");
      }

      const data = await response.json();
      console.log("Domain breach data:", data);
      return data;
    },
    enabled: false,
  });

  const handleEmailCheck = () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    refetchEmail();
    refetchAnalytics();
  };

  const handleDomainCheck = () => {
    if (!domain) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name",
        variant: "destructive",
      });
      return;
    }

    // Basic domain validation
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Invalid Domain Format",
        description: "Please enter a valid domain name (e.g., example.com)",
        variant: "destructive",
      });
      return;
    }

    refetchDomain();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const parseBreachList = (breaches: any) => {
    if (!breaches || !Array.isArray(breaches)) return [];

    // Handle different response formats
    if (Array.isArray(breaches[0])) {
      return breaches[0]; // Nested array format
    }
    return breaches;
  };

  const getBreachDetails = (breachName: string, analyticsData: any) => {
    if (!analyticsData?.ExposedBreaches?.breaches_details) return null;

    return analyticsData.ExposedBreaches.breaches_details.find(
      (breach: any) => breach.breach.toLowerCase() === breachName.toLowerCase()
    );
  };

  const getRateLimitMessage = (error: any) => {
    if (error?.message?.includes("Rate limit exceeded")) {
      return (
        <Alert className="border-yellow-500 bg-yellow-500/10">
          <Clock className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300">
            {error.message}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="border-red-500 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-300">
          {error?.message || "Failed to fetch data"}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SecYourScan
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Dark Web Monitoring & Breach Detection Platform
          </p>
          <p className="text-slate-400 mt-2">
            Protect your digital identity with comprehensive breach monitoring
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
              <TabsTrigger
                value="email"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600"
              >
                <Mail className="h-4 w-4" />
                Email Monitor
              </TabsTrigger>
              <TabsTrigger
                value="domain"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600"
              >
                <Globe className="h-4 w-4" />
                Domain Monitor
              </TabsTrigger>
            </TabsList>

            {/* Email Monitoring Tab */}
            <TabsContent value="email" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Mail className="h-5 w-5 text-purple-400" />
                    Email Breach Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Check if your email has been compromised in data breaches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <Button
                      onClick={handleEmailCheck}
                      disabled={emailLoading || analyticsLoading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {emailLoading || analyticsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      Scan
                    </Button>
                  </div>

                  {(emailError || analyticsError) &&
                    getRateLimitMessage(emailError || analyticsError)}

                  {/* Email Breach Results */}
                  {emailBreachData && (
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          {emailBreachData.breaches &&
                          parseBreachList(emailBreachData.breaches).length >
                            0 ? (
                            <XCircle className="h-5 w-5 text-red-400" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                          Breach Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {emailBreachData.breaches &&
                        parseBreachList(emailBreachData.breaches).length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">COMPROMISED</Badge>
                              <span className="text-slate-300">
                                {
                                  parseBreachList(emailBreachData.breaches)
                                    .length
                                }{" "}
                                breach(es) found
                              </span>
                            </div>
                            <div className="grid gap-3">
                              {parseBreachList(emailBreachData.breaches).map(
                                (breachName: string, index: number) => {
                                  const breachDetails = getBreachDetails(
                                    breachName,
                                    analyticsData
                                  );
                                  return (
                                    <div
                                      key={index}
                                      className="bg-slate-800 p-4 rounded-lg border border-slate-600"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-white">
                                          {breachName}
                                        </h4>
                                        {breachDetails?.password_risk && (
                                          <Badge
                                            variant={getBadgeVariant(
                                              breachDetails.password_risk
                                            )}
                                          >
                                            {breachDetails.password_risk}
                                          </Badge>
                                        )}
                                      </div>
                                      {breachDetails?.details && (
                                        <p className="text-slate-400 text-sm mb-2">
                                          {breachDetails.details}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-4 text-sm">
                                        {breachDetails?.xposed_date && (
                                          <span className="flex items-center gap-1 text-slate-300">
                                            <Calendar className="h-3 w-3" />
                                            {breachDetails.xposed_date}
                                          </span>
                                        )}
                                        {breachDetails?.xposed_records && (
                                          <span className="flex items-center gap-1 text-slate-300">
                                            <Database className="h-3 w-3" />
                                            {breachDetails.xposed_records.toLocaleString()}{" "}
                                            records
                                          </span>
                                        )}
                                      </div>
                                      {breachDetails?.xposed_data && (
                                        <div className="mt-2">
                                          <span className="text-xs text-slate-400">
                                            Exposed data:{" "}
                                            {breachDetails.xposed_data}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-400"
                            >
                              SECURE
                            </Badge>
                            <span className="text-slate-300">
                              No breaches found
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Analytics Results */}
                  {analyticsData?.BreachMetrics && (
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white">
                          Detailed Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">
                              {parseBreachList(emailBreachData?.breaches)
                                ?.length || 0}
                            </div>
                            <div className="text-slate-400">Total Breaches</div>
                          </div>
                          <div className="bg-slate-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">
                              {analyticsData.BreachMetrics.risk?.[0]
                                ?.risk_score || 0}
                              %
                            </div>
                            <div className="text-slate-400">Risk Score</div>
                          </div>
                          <div className="bg-slate-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">
                              {analyticsData.BreachMetrics
                                .passwords_strength?.[0]?.PlainText || 0}
                            </div>
                            <div className="text-slate-400">
                              Plain Text Passwords
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Domain Monitoring Tab */}
            <TabsContent value="domain" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="h-5 w-5 text-purple-400" />
                    Domain Breach Monitor
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Monitor domain-wide breaches and security incidents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter domain (e.g., example.com)"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <Button
                      onClick={handleDomainCheck}
                      disabled={domainLoading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {domainLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      Scan
                    </Button>
                  </div>

                  {domainError && getRateLimitMessage(domainError)}

                  {/* Domain Breach Results */}
                  {domainBreachData && (
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white">
                          Domain Security Report
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {domainBreachData.sendDomains?.breaches_details &&
                        domainBreachData.sendDomains.breaches_details.length >
                          0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <XCircle className="h-5 w-5 text-red-400" />
                              <Badge variant="destructive">
                                BREACHES DETECTED
                              </Badge>
                              <span className="text-slate-300">
                                {
                                  domainBreachData.sendDomains.breaches_details
                                    .length
                                }{" "}
                                incident(s) found
                              </span>
                            </div>
                            <div className="grid gap-3">
                              {domainBreachData.sendDomains.breaches_details.map(
                                (breach: any, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-slate-800 p-4 rounded-lg border border-slate-600"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-white">
                                        {breach.domain || "Unknown Domain"}
                                      </h4>
                                      <Badge
                                        variant={getBadgeVariant("Medium")}
                                      >
                                        Medium
                                      </Badge>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2">
                                      {breach.breach_count} breach incident(s),
                                      total of {breach.breach_total} records
                                      affected.
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="flex items-center gap-1 text-slate-300">
                                        <Calendar className="h-3 w-3" />
                                        {breach.breach_last_seen ||
                                          "Date unknown"}
                                      </span>
                                      <span className="flex items-center gap-1 text-slate-300">
                                        <Database className="h-3 w-3" />
                                        {breach.breach_emails} email(s) affected
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-400"
                            >
                              SECURE
                            </Badge>
                            <span className="text-slate-300">
                              No domain breaches detected
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
                  href="#"
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

export default Index;
