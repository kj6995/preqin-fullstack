import { Button } from "@/components/ui/button";

export default function AssetClassFilter({ assetClasses, selectedAssetClass, onSelect }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Asset Class Distribution</h2>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={(selectedAssetClass === null || selectedAssetClass === "all") ? "default" : "secondary"}
          onClick={() => onSelect("all")}
          className="min-w-[120px] mb-2"
        >
          All ({assetClasses.reduce((sum, ac) => sum + ac.totalAmount, 0).toLocaleString()})
        </Button>
        {assetClasses.map((assetClass) => (
          <Button
            key={assetClass.assetClass}
            variant={selectedAssetClass === assetClass.assetClass ? "default" : "secondary"}
            onClick={() => onSelect(assetClass.assetClass)}
            className="min-w-[120px] mb-2"
          >
            {assetClass.assetClass} ({assetClass.totalAmount.toLocaleString()})
          </Button>
        ))}
      </div>
    </div>
  );
}
