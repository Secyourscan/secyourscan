import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Calendar,
  Users,
  Database,
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface BreachData {
  breachID: string;
  breachedDate: string;
  domain: string;
  exposedData: string[];
  exposedRecords: number;
  exposureDescription: string;
  industry: string;
  passwordRisk: string;
  referenceURL: string;
  searchable: boolean;
  sensitive: boolean;
  verified: boolean;
}

const fetchBreaches = async (): Promise<BreachData[]> => {
  const response = await fetch(
    "https://secyourscan.aryan4.com.np/v1/all-breaches/"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch breaches data");
  }
  const data = await response.json();
  return Array.isArray(data.exposedBreaches) ? data.exposedBreaches : [];
};

const ExposedBreach = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxVisiblePages = 5; // Maximum number of page links to show at once

  const {
    data: breaches,
    isLoading,
    error,
  } = useQuery<BreachData[]>({
    queryKey: ["breaches"],
    queryFn: fetchBreaches,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Sort breaches by breachedDate in descending order (newest to oldest)
  const sortedBreaches = breaches
    ? [...breaches].sort(
        (a, b) =>
          new Date(b.breachedDate).getTime() -
          new Date(a.breachedDate).getTime()
      )
    : [];

  // Calculate total affected accounts
  const totalAffectedAccounts =
    sortedBreaches.reduce(
      (sum, breach) => sum + (breach.exposedRecords || 0),
      0
    ) || 0;

  // Calculate verified breaches
  const verifiedBreaches =
    sortedBreaches.filter((breach) => breach.verified).length || 0;

  // Calculate exposed passwords (breaches containing password data)
  const exposedPasswords =
    sortedBreaches.reduce(
      (sum, breach) =>
        breach.exposedData.some(
          (data) =>
            data.toLowerCase().includes("password") &&
            breach.passwordRisk !== "unknown"
        )
          ? sum + (breach.exposedRecords || 0)
          : sum,
      0
    ) || 0;

  // Pagination logic
  const totalPages = sortedBreaches.length
    ? Math.ceil(sortedBreaches.length / itemsPerPage)
    : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBreaches = sortedBreaches.slice(startIndex, endIndex) || [];

  // Calculate visible page range
  const getPageRange = () => {
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage reaches totalPages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Exposed Data Breaches
              </h1>
              <p className="text-slate-400 mt-1">
                Comprehensive database of known security breaches
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-slate-700" />
                    ) : (
                      sortedBreaches.length || 0
                    )}
                  </div>
                  <div className="text-slate-300 font-medium">
                    Total Breaches
                  </div>
                </div>
                <Database className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-slate-700" />
                    ) : (
                      formatNumber(totalAffectedAccounts)
                    )}
                  </div>
                  <div className="text-slate-300 font-medium">
                    Affected Accounts
                  </div>
                </div>
                <Users className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-slate-700" />
                    ) : (
                      verifiedBreaches
                    )}
                  </div>
                  <div className="text-slate-300 font-medium">
                    Verified Breaches
                  </div>
                </div>
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-slate-700" />
                    ) : (
                      formatNumber(exposedPasswords)
                    )}
                  </div>
                  <div className="text-slate-300 font-medium">
                    Exposed Passwords
                  </div>
                </div>
                <Key className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breaches Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Data Breach Database
            </CardTitle>
            <CardDescription className="text-slate-400">
              Complete list of documented security breaches and compromised data
              (Page {currentPage} of {totalPages})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4 bg-slate-700" />
                      <Skeleton className="h-3 w-1/2 bg-slate-700" />
                    </div>
                    <Skeleton className="h-6 w-16 bg-slate-700" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <div className="text-red-400 text-lg font-semibold mb-2">
                  Error Loading Data
                </div>
                <div className="text-slate-400">
                  Failed to fetch breach data. Please try again later.
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">
                          Service
                        </TableHead>
                        <TableHead className="text-slate-300">Domain</TableHead>
                        <TableHead className="text-slate-300">
                          Breach Date
                        </TableHead>
                        <TableHead className="text-slate-300">
                          Affected Accounts
                        </TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">
                          Data Types
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentBreaches.map((breach, index) => (
                        <TableRow
                          key={index}
                          className="border-slate-700 hover:bg-slate-800/30"
                        >
                          <TableCell className="font-medium">
                            <div className="text-white font-semibold">
                              {breach.breachID}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {breach.domain || "N/A"}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              {formatDate(breach.breachedDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300 font-mono">
                            {formatNumber(breach.exposedRecords)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {breach.verified && (
                                <Badge
                                  variant="outline"
                                  className="border-green-600 text-green-400"
                                >
                                  Verified
                                </Badge>
                              )}
                              {breach.sensitive && (
                                <Badge
                                  variant="outline"
                                  className="border-red-600 text-red-400"
                                >
                                  Sensitive
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="max-w-xs">
                              <div className="text-sm text-slate-400 truncate">
                                {breach.exposedData?.slice(0, 3).join(", ") ||
                                  "N/A"}
                                {breach.exposedData?.length > 3 && "..."}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className={`px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors ${
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700"
                            }`}
                            aria-disabled={currentPage === 1}
                            tabIndex={currentPage === 1 ? -1 : 0}
                          />
                        </PaginationItem>
                        {currentPage > 3 && totalPages > maxVisiblePages && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setCurrentPage(1)}
                              className="px-2 py-1 sm:px-3 sm:py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700"
                              aria-label="Go to page 1"
                            >
                              1
                            </PaginationLink>
                            {currentPage > 4 && (
                              <PaginationEllipsis className="text-slate-300" />
                            )}
                          </PaginationItem>
                        )}
                        {getPageRange().map((pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors ${
                                currentPage === pageNum
                                  ? "bg-purple-600 text-white"
                                  : "text-slate-300 hover:text-white hover:bg-slate-700"
                              }`}
                              aria-label={`Go to page ${pageNum}`}
                              aria-current={
                                currentPage === pageNum ? "page" : undefined
                              }
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        {currentPage < totalPages - 2 &&
                          totalPages > maxVisiblePages && (
                            <PaginationItem>
                              {currentPage < totalPages - 3 && (
                                <PaginationEllipsis className="text-slate-300" />
                              )}
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-2 py-1 sm:px-3 sm:py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700"
                                aria-label={`Go to page ${totalPages}`}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            className={`px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors ${
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700"
                            }`}
                            aria-disabled={currentPage === totalPages}
                            tabIndex={currentPage === totalPages ? -1 : 0}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExposedBreach;
