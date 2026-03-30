"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isReconnecting) return <div>Reconnecting...</div>;

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-2">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            variant="primary"
            size="pill"
            onClick={() => connect({ connector })}
            disabled={isConnecting}
          >
            Connect {connector.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <Button variant="pillSecondary" size="pill" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  );
}
