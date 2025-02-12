"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import InvestorTable from "@/components/InvestorTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getApiUrl } from "@/config/env";

export default function InvestorsPage() {
  const [investors, setInvestors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInvestors();
  }, [currentPage]);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get(getApiUrl('/api/investors'), {
        params: { page: currentPage },
      });
      setInvestors(response.data.investors);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-20">
        <h1 className="text-3xl font-bold text-gray-900">Preqin</h1>
        <p className="text-gray-700">List of all the investors and their commitments.</p>
        <p className="text-gray-500">Click on any row to see further details.</p>
      </div>
      <Card>
        <CardContent className="p-4">
          <InvestorTable
            investors={investors}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
