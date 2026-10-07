"use client";

import { useEffect } from "react";
import { useCalculadoraStore } from "../store/useCalculadoraStore";

export function StoreHydration() {
  useEffect(() => {
    void useCalculadoraStore.persist.rehydrate();
  }, []);

  return null;
}
