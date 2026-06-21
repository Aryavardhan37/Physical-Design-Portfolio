import { useEffect, useState } from "react";

export function formatVisitorCount(count) {
  return count === null ? "Loading..." : String(count);
}

export function useVisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // ✅ Read the current count only; do not increment on refresh
    fetch("https://api.counterapi.dev/v1/aryavardhan-portfolio/visits/")
      .then((res) => res.json())
      .then((data) => setCount(data.count ?? null))
      .catch(() => setCount(null));
  }, []);

  return count;
}