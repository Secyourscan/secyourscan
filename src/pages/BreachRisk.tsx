import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Shield,
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Database,
  Key,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BreachRisk = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast({
        title: "No Email Provided",
        description: "Please provide an email address to view breach analytics",
        variant: "destructive",
      });
      navigate("/scan");
    }
  }, [email, navigate]);

  // Fetch detailed analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["breach-analytics", email],
    queryFn: async () => {
      const response = await fetch(
        `https://secyourscan.aryan4.com.np/v1/breach-analytics/?email=${email}`
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
        throw new Error("Failed to fetch breach analytics");
      }

      const data = await response.json();
      console.log("Detailed analytics data:", JSON.stringify(data, null, 2)); // Debug log
      return data;
    },
    enabled: !!email,
  });

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

  // Prepare chart data for visualization
  const prepareChartData = () => {
    if (!analyticsData?.ExposedBreaches?.breaches_details) return [];

    const breachData = analyticsData.ExposedBreaches.breaches_details.map(
      (breach: any) => ({
        name: breach.breach || "Unknown",
        records: breach.xposed_records || 0,
        year: breach.xposed_date
          ? new Date(breach.xposed_date).getFullYear()
          : "Unknown",
      })
    );

    return breachData.slice(0, 10); // Show top 10 breaches
  };

  // Predefined color palette for categories
  const categoryColors: { [key: string]: string } = {
    "📞 Communication and Social Interactions": "#4CAF50",
    "👤 Personal Identification": "#2196F3",
    "🔒 Security Practices": "#F44336",
    "👥 Demographics": "#FF9800",
    "🖥️ Device and Network Information": "#9C27B0",
  };

  // Prepare data categories by level2 with level3 sub-items
  const prepareDataCategories = () => {
    if (!analyticsData?.BreachMetrics?.xposed_data) {
      console.log("No xposed_data available in BreachMetrics"); // Debug log
      return [];
    }

    const categories = new Map<
      string,
      { count: number; items: Map<string, number> }
    >();

    const xposedData = analyticsData.BreachMetrics.xposed_data;
    console.log("xposed_data:", JSON.stringify(xposedData, null, 2)); // Debug log

    if (Array.isArray(xposedData)) {
      xposedData.forEach((level1: any, level1Index: number) => {
        console.log(
          `Processing level1 ${level1Index}:`,
          JSON.stringify(level1, null, 2)
        ); // Debug log
        if (level1.children && Array.isArray(level1.children)) {
          level1.children.forEach((level2: any) => {
            const categoryName = level2.name || "Unknown Category";
            let category = categories.get(categoryName) || {
              count: 0,
              items: new Map<string, number>(),
            };

            if (level2.children && Array.isArray(level2.children)) {
              level2.children.forEach((level3: any) => {
                console.log(
                  `Processing level3:`,
                  JSON.stringify(level3, null, 2)
                ); // Debug log
                const dataType =
                  level3.name?.replace(/^data_/, "") || "Unknown";
                const value = Number(level3.value) || 0;
                category.items.set(
                  dataType,
                  (category.items.get(dataType) || 0) + value
                );
                category.count += value; // Sum values for total items in category
              });
            } else {
              console.log(`No level3 children for level2: ${categoryName}`); // Debug log
            }

            categories.set(categoryName, category);
          });
        } else {
          console.log(`No level2 children for level1 ${level1Index}`); // Debug log
        }
      });
    } else {
      console.log("xposed_data is not an array"); // Debug log
    }

    const result = Array.from(categories.entries())
      .map(([category, { count, items }]) => ({
        category,
        count,
        color: categoryColors[category] || "#CCCCCC", // Fallback color
        items: Array.from(items.entries()).map(([name, count]) => ({
          name,
          count,
        })),
      }))
      .sort((a, b) => b.count - a.count); // Sort by total items descending

    console.log("Prepared categories:", JSON.stringify(result, null, 2)); // Debug log
    return result;
  };

  const chartConfig = {
    records: {
      label: "Records Exposed",
      color: "#8b5cf6",
    },
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/scan")}
            variant="ghost"
            className="text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Breach Risk Analysis
            </h1>
          </div>
          <p className="text-slate-300">
            Detailed security analysis for:{" "}
            <span className="font-mono text-purple-400">{email}</span>
          </p>
        </div>

        {analyticsError && getRateLimitMessage(analyticsError)}

        {analyticsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <span className="text-slate-300 text-lg">
                Analyzing breach data...
              </span>
            </div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-6">
            {/* Risk Metrics Overview */}
            {analyticsData.BreachMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-600/20 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {analyticsData.BreachMetrics.risk?.[0]?.risk_score || 0}%
                    </div>
                    <div className="text-slate-300 font-medium">Risk Score</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Overall security risk
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <Database className="h-6 w-6 text-blue-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {analyticsData.ExposedBreaches?.breaches_details
                        ?.length || 0}
                    </div>
                    <div className="text-slate-300 font-medium">
                      Total Breaches
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Known incidents
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <Eye className="h-6 w-6 text-green-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {analyticsData.BreachMetrics.passwords_strength?.[0]
                        ?.PlainText || 0}
                    </div>
                    <div className="text-slate-300 font-medium">
                      Plain Text Passwords
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Unencrypted credentials
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-600/20 rounded-lg">
                        <Key className="h-6 w-6 text-orange-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      {analyticsData.BreachMetrics.passwords_strength?.[0]
                        ?.StrongHash || 0}
                    </div>
                    <div className="text-slate-300 font-medium">
                      Hashed Passwords
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Encrypted credentials
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Your Exposed Data Sorted by Categories */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5 text-purple-400" />
                  Your Exposed Data Sorted by Categories
                </CardTitle>
                <CardDescription className="text-slate-400">
                  For Email: {email || "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prepareDataCategories().length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">
                      {analyticsData?.BreachMetrics?.xposed_data
                        ? "No exposed data found for this email."
                        : "Unable to load breach data. Please try again later."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {prepareDataCategories().map((category) => (
                      <div
                        key={category.category}
                        className="bg-slate-700/50 p-4 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">
                            {category.category} ({category.count} item
                            {category.count !== 1 ? "s" : ""})
                          </h3>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                            aria-label={`Color indicator for ${category.category}`}
                          />
                        </div>
                        <ul className="list-disc pl-5 text-slate-400 text-sm">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              {item.name} {item.count}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visualisation Of Exposed Data Breaches */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Visualisation Of Exposed Data Breaches
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Records exposed across different breaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <BarChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="records"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Your Exposed Data Breaches in Detail */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5 text-purple-400" />
                  Your Exposed Data Breaches in Detail
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Comprehensive information about security incidents affecting
                  this email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.ExposedBreaches?.breaches_details?.map(
                    (breach: any, index: number) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 p-6 rounded-lg border border-slate-600"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-white">
                            {breach.breach || "Unknown Breach"}
                          </h3>
                          {breach.password_risk && (
                            <Badge
                              variant={getBadgeVariant(breach.password_risk)}
                            >
                              {breach.password_risk} Risk
                            </Badge>
                          )}
                        </div>

                        {breach.details && (
                          <p className="text-slate-300 mb-4">
                            {breach.details}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {breach.xposed_date && (
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar className="h-4 w-4 text-purple-400" />
                              <span className="text-sm">
                                <div className="font-medium">Breach Date</div>
                                <div className="text-slate-400">
                                  {formatDate(breach.xposed_date)}
                                </div>
                              </span>
                            </div>
                          )}

                          {breach.xposed_records && (
                            <div className="flex items-center gap-2 text-slate-300">
                              <Database className="h-4 w-4 text-blue-400" />
                              <span className="text-sm">
                                <div className="font-medium">
                                  Records Affected
                                </div>
                                <div className="text-slate-400">
                                  {breach.xposed_records.toLocaleString()}
                                </div>
                              </span>
                            </div>
                          )}

                          {breach.xposed_data && (
                            <div className="flex items-center gap-2 text-slate-300">
                              <Key className="h-4 w-4 text-orange-400" />
                              <span className="text-sm">
                                <div className="font-medium">Data Exposed</div>
                                <div className="text-slate-400">
                                  {breach.xposed_data}
                                </div>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) || (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Breaches Found
                      </h3>
                      <p className="text-slate-400">
                        Great news! We couldn't find any data breaches for this
                        email address.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Password Strength Analysis */}
            {analyticsData.BreachMetrics?.passwords_strength && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Key className="h-5 w-5 text-orange-400" />
                    Password Security Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Analysis of password security across breached accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {analyticsData.BreachMetrics.passwords_strength[0]
                          ?.PlainText || 0}
                      </div>
                      <div className="text-slate-300 font-medium">
                        Plain Text
                      </div>
                      <div className="text-sm text-slate-400">
                        Unencrypted passwords
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {analyticsData.BreachMetrics.passwords_strength[0]
                          ?.StrongHash || 0}
                      </div>
                      <div className="text-slate-300 font-medium">Hashed</div>
                      <div className="text-sm text-slate-400">
                        Encrypted passwords
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {analyticsData.BreachMetrics.passwords_strength[0]
                          ?.Unknown || 0}
                      </div>
                      <div className="text-slate-300 font-medium">Unknown</div>
                      <div className="text-sm text-slate-400">Unknown</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Detailed Data Available
                </h3>
                <p className="text-slate-400">
                  We couldn't find detailed breach analytics for this email
                  address.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BreachRisk;
