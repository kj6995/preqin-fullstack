"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import InvestorTable from "@/components/InvestorTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getApiUrl } from "@/config/env";

export default function InvestorsPage() {
  const [investors, setInvestors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInvestors();
  }, [searchQuery, currentPage]);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get(getApiUrl('/api/investors'), {
        params: { search: searchQuery, page: currentPage },
      });
      setInvestors(response.data.investors);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-4">
          <Input
            type="text"
            placeholder="Search Investors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
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
