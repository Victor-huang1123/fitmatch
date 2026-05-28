"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VenuesRedirect() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    // 保留原有的 query params 傳遞給 /search
    const params = new URLSearchParams();
    const keyword = sp.get("keyword");
    const category = sp.get("category");
    if (keyword) params.set("q", keyword);
    if (category) params.set("category", category);
    router.replace(`/search${params.size ? `?${params.toString()}` : ""}`);
  }, [router, sp]);

  return null;
}

export default function VenuesPage() {
  return (
    <Suspense fallback={null}>
      <VenuesRedirect />
    </Suspense>
  );
}
