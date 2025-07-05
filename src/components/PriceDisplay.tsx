
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { priceService, type PriceData } from "@/services/priceService";

const PriceDisplay = () => {
  const [btcPrice, setBtcPrice] = useState<PriceData | null>(null);
  const [stxPrice, setStxPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [btc, stx] = await Promise.all([
          priceService.getBitcoinPrice(),
          priceService.getStacksPrice()
        ]);
        setBtcPrice(btc);
        setStxPrice(stx);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const PriceCard = ({ price }: { price: PriceData | null }) => {
    if (!price) return null;

    const isPositive = price.change24h >= 0;
    
    return (
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-white">
            {price.symbol} ${price.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">
            Last updated: {new Date(price.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {isPositive ? '+' : ''}{price.change24h.toFixed(2)}%
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-white font-semibold mb-3">Market Prices</h3>
        <PriceCard price={btcPrice} />
        <PriceCard price={stxPrice} />
      </CardContent>
    </Card>
  );
};

export default PriceDisplay;
