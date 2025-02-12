"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import InvestorDetails from "@/components/InvestorDetails";
import AssetClassFilter from "@/components/AssetClassFilter";
import { getApiUrl } from "@/config/env";

export default function InvestorDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [investor, setInvestor] = useState(null);
  const [commitments, setCommitments] = useState([]);
  const [selectedAssetClass, setSelectedAssetClass] = useState(null);
  const [assetClassSummary, setAssetClassSummary] = useState([]);
  const [totalCommitment, setTotalCommitment] = useState(0);

  useEffect(() => {
    fetchInvestorDetails();
  }, [params.id]);

  const fetchInvestorDetails = async () => {
    try {
      const response = await axios.get(getApiUrl(`/api/investors/${params.id}/commitments`));
      setInvestor(response.data.name);
      setCommitments(response.data.commitments);
      setAssetClassSummary(response.data.assetClassSummary);
      setTotalCommitment(response.data.totalCommitment);
    } catch (error) {
      console.error("Error fetching investor details:", error);
    }
  };

  const filteredCommitments = selectedAssetClass
    ? commitments.filter((c) => c.assetClass === selectedAssetClass)
    : commitments;

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-4">
          <h1 className="text-xl font-bold mb-4">Investor: {investor}</h1>
          <AssetClassFilter
            assetClasses={assetClassSummary}
            totalCommitment={totalCommitment}
            selectedAssetClass={selectedAssetClass}
            onSelect={setSelectedAssetClass}
          />
          <InvestorDetails commitments={filteredCommitments} />
        </CardContent>
      </Card>
    </div>
  );
}
