"use client";

import { useEffect, useState } from "react";

type PromoAlert = {
  active: boolean;
  message: string;
};

// Mock — swap this with a real API call later
async function fetchPromoAlert(): Promise<PromoAlert> {
  return {
    active: true,
    message: "Free shipping on all orders over $50!",
  };
}

export function Promo() {
  const [alert, setAlert] = useState<PromoAlert | null>(null);

  useEffect(() => {
    fetchPromoAlert().then(setAlert);
  }, []);

  if (!alert?.active) return null;

  return (
    <div className="w-full bg-black py-2">
      <p className="text-center text-sm text-white">{alert.message}</p>
    </div>
  );
}
