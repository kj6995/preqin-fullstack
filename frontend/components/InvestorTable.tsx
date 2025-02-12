"use client"
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Investor {
  id: number;
  name: string;
  investorType: string;
  country: string;
  totalCommitment: number;
}

interface InvestorTableProps {
  investors: Investor[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InvestorTable({ 
  investors, 
  currentPage, 
  totalPages, 
  onPageChange 
}: InvestorTableProps) {
  const router = useRouter();

  if (!investors || investors.length === 0) {
    return <p className="text-center text-gray-500">No investors found.</p>;
  }

  const handleRowClick = (investorId: number) => {
    router.push(`/${investorId}`);
  };

  return (
    <div>
      <Table className="min-w-full border border-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Investor Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Total Commitment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investors.map((investor) => (
            <TableRow 
              key={investor.id} 
              className="border-t cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(investor.id)}
            >
              <TableCell>{investor.id}</TableCell>
              <TableCell>{investor.name}</TableCell>
              <TableCell>{investor.investorType}</TableCell>
              <TableCell>{investor.country}</TableCell>
              <TableCell>{investor.totalCommitment.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex justify-between items-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button 
          variant="outline" 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
