"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function KurulumRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/ceviriler/${params.slug}`);
  }, [params.slug, router]);

  return (
    <div className="min-h-screen bg-[#12110E] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
