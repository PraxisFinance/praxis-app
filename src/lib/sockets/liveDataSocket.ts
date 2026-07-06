import { io, type Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

/** Lazy singletons, keyed by namespace path — created on first call, reused thereafter. */
const sockets = new Map<string, Socket>();

function getNamespaceSocket(namespace: string): Socket {
  let socket = sockets.get(namespace);
  if (!socket) {
    socket = io(`${BACKEND_URL}${namespace}`, {
      transports: ["websocket"],
      autoConnect: false,
    });
    sockets.set(namespace, socket);
  }
  return socket;
}

/**
 * Returns the shared `/source` Socket.IO instance.
 * Broadcasts `live_sports_update` and `live_esports_update` without requiring
 * any subscription message — updates flow immediately after connecting.
 */
export function getSourceSocket(): Socket {
  return getNamespaceSocket("/source");
}

/**
 * Returns the shared `/markets` Socket.IO instance.
 * Requires emitting `subscribe_market_prices` after connecting to receive
 * `oraclePriceData` events for specific markets.
 */
export function getMarketsSocket(): Socket {
  return getNamespaceSocket("/markets");
}
