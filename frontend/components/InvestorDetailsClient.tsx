"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import InvestorDetails from "@/components/InvestorDetails";
import AssetClassFilter from "@/components/AssetClassFilter";
import { getApiUrl } from "@/config/env";

interface InvestorDetailsClientProps {
  id: string;
}

export default function InvestorDetailsClient({
  id,
}: InvestorDetailsClientProps) {
  const [investor, setInvestor] = useState(null);
  const [commitments, setCommitments] = useState([]);
  const [selectedAssetClass, setSelectedAssetClass] = useState(null);
  const [assetClassSummary, setAssetClassSummary] = useState([]);
  const [totalCommitment, setTotalCommitment] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial data fetch when id changes
  useEffect(() => {
    if (!id) return;
    setCurrentPage(1);
    setSelectedAssetClass(null);
    fetchInvestorDetails(1, null);
  }, [id]);

  // Handle pagination and filter changes
  useEffect(() => {
    if (!id) return;
    // Skip the initial fetch as it's handled by the first effect
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
          <h1 className="text-xl font-bold mb-4">Investor: {investor}</h1>
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
