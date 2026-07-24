/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ETF } from '../types';
import { ETFS_LIST } from '../data/etfData';
import { fetchEtfListFromSupabase } from '../services/supabaseEtfService';

interface EtfDataContextType {
  etfs: ETF[];
  isLoading: boolean;
  lastUpdated: Date | null;
}

const EtfDataContext = createContext<EtfDataContextType>({
  etfs: ETFS_LIST,
  isLoading: false,
  lastUpdated: null,
});

export function useEtfData() {
  return useContext(EtfDataContext);
}

interface EtfDataProviderProps {
  children: ReactNode;
}

/**
 * Provider that fetches live ETF data from Supabase on mount and provides
 * the enriched list to all child components. Falls back to ETFS_LIST instantly.
 */
export function EtfDataProvider({ children }: EtfDataProviderProps) {
  const [etfs, setEtfs] = useState<ETF[]>(ETFS_LIST); // Instant render with static data
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchEtfListFromSupabase()
      .then((liveEtfs) => {
        if (isMounted && liveEtfs.length > 0) {
          setEtfs(liveEtfs);
          setLastUpdated(new Date());
          console.log(`[EtfDataProvider] Loaded ${liveEtfs.length} ETFs with live prices`);
        }
      })
      .catch((e) => {
        console.warn('[EtfDataProvider] Failed, using local data:', e);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <EtfDataContext.Provider value={{ etfs, isLoading, lastUpdated }}>
      {children}
    </EtfDataContext.Provider>
  );
}
