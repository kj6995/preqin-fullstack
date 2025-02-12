import { Button } from "@/components/ui/button";

export default function AssetClassFilter({ assetClasses, selectedAssetClass, onSelect }) {
  return (
    <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto">
      <Button 
        variant={(selectedAssetClass === null || selectedAssetClass === "all") ? "default" : "secondary"}
        onClick={() => onSelect("all")}
      >
        All ({assetClasses.reduce((sum, ac) => sum + ac.totalAmount, 0).toLocaleString()})
      </Button>
      {assetClasses.map((assetClass) => (
        <Button
          key={assetClass.assetClass}
          variant={selectedAssetClass === assetClass.assetClass ? "default" : "secondary"}
          onClick={() => onSelect(assetClass.assetClass)}
        >
          {assetClass.assetClass} ({assetClass.totalAmount.toLocaleString()})
        </Button>
      ))}
    </div>
  );
}
