import { useState, useEffect } from "react";
import { Op } from "@/types";

const API_URL = "https://frontend-challenge.veryableops.com/";

export function useOps() {
  const [ops, setOps] = useState<Op[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOps = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch ops: ${res.status}`);
        }
        const data: Op[] = await res.json();
        setOps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOps();
  }, []);

  return { ops, loading, error };
}
