import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../components/WalletContext";

export function useAnalytics() {
  const { address, disconnect } = useWalletContext();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);

  useEffect(() => {
    if (!address) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/analytics?address=${address}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            res.status === 404 ? "User not found" : errorText || "Failed to load analytics"
          );
        }
        const analyticsData = await res.json();
        console.log("Analytics Data:", analyticsData);
        setData({
          ...analyticsData,
          uniqueVisitors: analyticsData.uniqueVisitors ?? Math.round(analyticsData.totalClicks * 0.8),
          socialReferrals: analyticsData.socialReferrals ?? [
            { platform: "Twitter", clicks: 0 },
            { platform: "Reddit", clicks: 0 },
            { platform: "LinkedIn", clicks: 0 },
          ],
          revenue: analyticsData.revenue ?? { total: 0, conversions: 0 },
        });
      } catch (err: any) {
        console.error("Fetch Analytics Error:", err);
        setError(err.message || "An error occurred while loading analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [address]);

  return { data, loading, error, address, disconnect, router };
}