"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import InvestorDetails from "@/components/InvestorDetails";
import AssetClassFilter from "@/components/AssetClassFilter";
import { getApiUrl } from "@/config/env";

interface InvestorDetailsClientProps {
  id: string;
}

export default function InvestorDetailsClient({
  id,
}: InvestorDetailsClientProps) {
  const router = useRouter();
  const [investor, setInvestor] = useState(null);
  const [commitments, setCommitments] = useState([]);
  const [selectedAssetClass, setSelectedAssetClass] = useState("all");
  const [assetClassSummary, setAssetClassSummary] = useState([]);
  const [totalCommitment, setTotalCommitment] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial data fetch when id changes
  useEffect(() => {
    if (!id) return;
    setCurrentPage(1);
    setSelectedAssetClass("all");
    fetchInvestorDetails(1, null);
  }, [id]);

  // Handle pagination and filter changes
  useEffect(() => {
    if (!id) return;
    if (currentPage === 1 && !selectedAssetClass) return;
    if (selectedAssetClass === "all") {
      fetchInvestorDetails(currentPage, null);
    } else {
      fetchInvestorDetails(currentPage, selectedAssetClass);
    }
  }, [currentPage, selectedAssetClass]);

  const fetchInvestorDetails = async (
    page: number,
    assetClass: string | null
  ) => {
    try {
      const response = await axios.get(
        getApiUrl(`/api/investors/${id}/commitments`),
        {
          params: {
            page,
            filterByAssetClass: assetClass,
          },
        }
      );

      setInvestor(response.data.name);
      setCommitments(response.data.commitments);
      setAssetClassSummary(response.data.assetClassSummary);
      setTotalCommitment(response.data.totalCommitment);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching investor details:", error);
    }
  };

  const handleAssetClassChange = (newAssetClass: string) => {
    setSelectedAssetClass(newAssetClass);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push("/")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Investor: {investor}</h1>
          </div>
          <AssetClassFilter
            assetClasses={assetClassSummary}
            selectedAssetClass={selectedAssetClass}
            onSelect={handleAssetClassChange}
          />
          <InvestorDetails
            commitments={commitments}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
