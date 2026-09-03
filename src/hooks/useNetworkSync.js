import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { syncPendingSessions } from '../services/sessionSync';
import { syncReferenceData } from '../services/referenceDataSync';
import { getTestsFromLocalDb, getSportsFromLocalDb } from '../services/localDb';

/**
 * Custom React Hook for automatic offline-first synchronization & network state detection.
 * 
 * Features:
 *  - Subscribes to NetInfo connectivity state.
 *  - Subscribes to AppState (foreground / launch events).
 *  - Triggers push sync (sessions) when connectivity is restored or app enters foreground.
 *  - Triggers pull sync (reference data) on launch or when online.
 *  - Detects first-time launch without internet (needsFirstTimeSetup).
 * 
 * @param {string} userId - Optional logged-in user ID
 */
export function useNetworkSync(userId = null) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [needsFirstTimeSetup, setNeedsFirstTimeSetup] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const prevIsOnline = useRef(null);

  /**
   * Checks if local reference data exists.
   * If database is empty and network is offline, sets needsFirstTimeSetup = true.
   */
  const checkFirstTimeSetupStatus = useCallback(async (onlineStatus) => {
    try {
      const tests = await getTestsFromLocalDb();
      const sports = await getSportsFromLocalDb();
      
      const hasLocalData = tests.length > 0 || sports.length > 0;
      
      if (!hasLocalData && !onlineStatus) {
        setNeedsFirstTimeSetup(true);
      } else {
        setNeedsFirstTimeSetup(false);
      }
    } catch (err) {
      console.warn('[useNetworkSync] Error checking first time setup status:', err);
    }
  }, []);

  /**
   * Triggers full bidirectional synchronization (Push pending sessions + Pull reference data).
   */
  const syncAll = useCallback(async (currentOnlineState = isOnline) => {
    setIsSyncing(true);
    try {
      if (currentOnlineState) {
        // PULL SYNC (Reference Data)
        await syncReferenceData(true);

        // PUSH SYNC (User Sessions)
        await syncPendingSessions();

        setLastSyncedAt(new Date());
        setNeedsFirstTimeSetup(false);
      } else {
        console.log('[useNetworkSync] Device offline. Skipping cloud sync operations.');
        await checkFirstTimeSetupStatus(false);
      }
    } catch (error) {
      console.error('[useNetworkSync] Error during syncAll operation:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, checkFirstTimeSetupStatus]);

  // -------------------------------------------------------------------------
  // NetInfo Event Listener (Connectivity change)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);

      // Trigger sync if connectivity was restored (offline -> online transition)
      if (prevIsOnline.current === false && online) {
        console.log('[useNetworkSync] Network connection restored. Triggering auto-sync...');
        syncPendingSessions().catch(err => console.error('[useNetworkSync] Auto push sync error:', err));
        syncReferenceData(true).catch(err => console.error('[useNetworkSync] Auto pull sync error:', err));
      }

      prevIsOnline.current = online;
      checkFirstTimeSetupStatus(online);
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, [checkFirstTimeSetupStatus]);

  // -------------------------------------------------------------------------
  // AppState Listener (Launch & Foreground detection)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Initial sync trigger on hook mount (App Launch)
    NetInfo.fetch().then(state => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      prevIsOnline.current = online;

      if (online) {
        syncAll(true);
      } else {
        checkFirstTimeSetupStatus(false);
      }
    });

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('[useNetworkSync] App came to foreground. Triggering sync...');
        NetInfo.fetch().then(state => {
          const online = Boolean(state.isConnected && state.isInternetReachable !== false);
          setIsOnline(online);
          if (online) {
            syncPendingSessions().catch(err => console.error('[useNetworkSync] Foreground push sync error:', err));
            syncReferenceData(true).catch(err => console.error('[useNetworkSync] Foreground pull sync error:', err));
          }
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [syncAll, checkFirstTimeSetupStatus]);

  return {
    isOnline,
    isSyncing,
    needsFirstTimeSetup,
    setupWarningMessage: needsFirstTimeSetup 
      ? 'Please connect to the internet to complete first-time setup.' 
      : null,
    lastSyncedAt,
    syncAll
  };
}
