"use client"
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Commitment {
  id: number;
  assetClass: string;
  currency: string;
  amount: number;
}

interface InvestorDetailsProps {
  commitments: Commitment[];
  currentPage: number;
  totalPages: number;
  totalCommitments: number;
  onPageChange: (page: number) => void;
}

export default function InvestorDetails({ 
  commitments, 
  currentPage, 
  totalPages, 
  totalCommitments,
  onPageChange 
}: InvestorDetailsProps) {
  if (!commitments || commitments.length === 0) {
    return <p className="text-center text-gray-500">No commitments available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border border-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Asset Class</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Commitment Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commitments.map((commitment) => (
            <TableRow key={commitment.id} className="border-t">
              <TableCell>{commitment.id}</TableCell>
              <TableCell>{commitment.assetClass}</TableCell>
              <TableCell>{commitment.currency}</TableCell>
              <TableCell>{commitment.amount.toLocaleString()}</TableCell>
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
        <span>
          Page {currentPage} of {totalPages} 
          <span className="ml-2 text-gray-500">
            (Total {totalCommitments} commitments)
          </span>
        </span>
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
