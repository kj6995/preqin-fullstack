import { Button } from "@/components/ui/button";

export default function AssetClassFilter({ assetClasses, selectedClass, onSelect }) {
  return (
    <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto">
      <Button 
        variant={selectedClass === null ? "default" : "outline"} 
        onClick={() => onSelect("all")}
      >
        All ({assetClasses.reduce((sum, ac) => sum + ac.totalAmount, 0).toLocaleString()})
      </Button>
      {assetClasses.map((assetClass) => (
        <Button
          key={assetClass.assetClass}
          variant={selectedClass === assetClass.assetClass ? "default" : "outline"}
          onClick={() => onSelect(assetClass.assetClass)}
        >
          {assetClass.assetClass} ({assetClass.totalAmount.toLocaleString()})
        </Button>
      ))}
    </div>
  );
}
