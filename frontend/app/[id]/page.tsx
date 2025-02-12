import { use } from "react";
import InvestorDetailsClient from "@/components/InvestorDetailsClient";

export default function Page({ params }: { params: { id: string } }) {
  const unwrappedParams = use(Promise.resolve(params));
  return <InvestorDetailsClient id={unwrappedParams.id} />;
}
