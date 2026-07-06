"use client";

import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { getSourceSocket, getMarketsSocket } from "@/lib/sockets/liveDataSocket";
import { useLiveDataStore } from "@/stores/liveDataStore";

/**
 * Wires `connect`/`disconnect` listeners that report connection state, with
 * an optional extra callback to run right after `connect` fires (e.g. to
 * (re-)subscribe to rooms). Returns an unbind function for effect cleanup.
 */
function bindConnectionState(
  socket: Socket,
  setConnected: (connected: boolean) => void,
  onConnected?: () => void,
): () => void {
  const onConnect = () => {
    setConnected(true);
    onConnected?.();
  };
  const onDisconnect = () => setConnected(false);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
}

/**
 * Connects to the `/source` Socket.IO namespace and feeds incoming sport and
 * esport live-score updates into `useLiveDataStore`.
 *
 * Call once at the predictions hub level (e.g. `PredictionsHubPage`).
 * The socket is a singleton — safe to call from multiple components.
 *
 * Zustand action references are stable (created once), so they are safe to
 * use as effect dependencies.
 */
export function useSourceConnection(): void {
  const handleSportUpdate = useLiveDataStore((s) => s.handleSportUpdate);
  const handleEsportsUpdate = useLiveDataStore((s) => s.handleEsportsUpdate);
  const setSourceConnected = useLiveDataStore((s) => s.setSourceConnected);

  useEffect(() => {
    const socket = getSourceSocket();
    const unbindConnection = bindConnectionState(socket, setSourceConnected);

    socket.on("live_sports_update", handleSportUpdate);
    socket.on("live_esports_update", handleEsportsUpdate);

    if (!socket.connected) socket.connect();

    return () => {
      unbindConnection();
      socket.off("live_sports_update", handleSportUpdate);
      socket.off("live_esports_update", handleEsportsUpdate);
      socket.disconnect();
    };
  }, [handleSportUpdate, handleEsportsUpdate, setSourceConnected]);
}

/**
 * Connects to the `/markets` Socket.IO namespace and subscribes to oracle
 * price data for the supplied market addresses (CPF `conditionId`s) and slugs.
 *
 * Re-subscribes automatically when the `addresses` or `slugs` arrays change
 * (deduplication is handled server-side, so re-emitting is always safe).
 *
 * @param addresses  On-chain market addresses to subscribe to (e.g. pool conditionIds).
 * @param slugs      Human-readable market slugs to subscribe to.
 */
export function useMarketsConnection(
  addresses: string[],
  slugs: string[] = [],
): void {
  const handleOraclePrice = useLiveDataStore((s) => s.handleOraclePriceData);
  const setMarketsConnected = useLiveDataStore((s) => s.setMarketsConnected);

  // Serialised for stable dependency comparison.
  const addressKey = addresses.join(",");
  const slugKey = slugs.join(",");

  useEffect(() => {
    if (addresses.length === 0 && slugs.length === 0) return;

    const socket = getMarketsSocket();
    const subscribe = () =>
      socket.emit("subscribe_market_prices", {
        marketAddresses: addresses,
        marketSlugs: slugs,
      });

    const unbindConnection = bindConnectionState(socket, setMarketsConnected, subscribe);
    socket.on("oraclePriceData", handleOraclePrice);

    if (socket.connected) {
      subscribe();
    } else {
      socket.connect();
    }

    return () => {
      unbindConnection();
      socket.off("oraclePriceData", handleOraclePrice);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressKey, slugKey, handleOraclePrice, setMarketsConnected]);
}
