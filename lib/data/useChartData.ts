"use client";

import { useState, useEffect, useCallback } from "react";
import { SAMPLE_CHART_REGISTRY, ChartDataset } from "./chart-data";

export interface UseChartDataOptions<T = any> {
  initialData?: T;
  simulatedDelayMs?: number;
  shouldError?: boolean;
  empty?: boolean;
}

export interface UseChartDataReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isSample: boolean;
  title: string;
  units: string;
  summary: string;
  refetch: () => void;
}

export function useChartData<T = any>(
  key: string,
  options: UseChartDataOptions<T> = {}
): UseChartDataReturn<T> {
  const dataset = SAMPLE_CHART_REGISTRY[key];
  
  const [data, setData] = useState<T | null>(
    options.empty ? null : (options.initialData ?? (dataset?.data as T) ?? null)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(
    options.shouldError ? new Error("Failed to load telemetry metric stream") : null
  );

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    const delay = options.simulatedDelayMs ?? 0;

    const timer = setTimeout(() => {
      if (options.shouldError) {
        setError(new Error(`Failed to load dataset for [${key}]`));
        setData(null);
      } else if (options.empty) {
        setData(null);
      } else {
        const resolvedData = options.initialData ?? (dataset?.data as T) ?? null;
        setData(resolvedData);
      }
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [key, options.shouldError, options.empty, options.initialData, options.simulatedDelayMs, dataset]);

  useEffect(() => {
    if (options.simulatedDelayMs && options.simulatedDelayMs > 0) {
      fetchData();
    }
  }, [fetchData, options.simulatedDelayMs]);

  return {
    data,
    loading,
    error,
    isSample: dataset ? dataset.isSample : true,
    title: dataset?.title ?? key,
    units: dataset?.units ?? "",
    summary: dataset?.summary ?? `Data visualization for ${key}`,
    refetch: fetchData,
  };
}
