import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";

export default function InvestorDetails({ commitments }) {
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
    </div>
  );
}
