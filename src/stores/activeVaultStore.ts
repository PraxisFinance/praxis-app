import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TOKEN_ADDRESSES } from "@/config/tokens";
import { useDepositsStore, type VaultState } from "@/stores/depositsStore";
import {
  pickActiveVaultId,
  pickLatestVault,
} from "@/shared/utils/activeVaultPicker";

interface ActiveVaultState {
  manualOverrideId: string | null;
  userAddress: string | null;
  activeVaultId: string | null;
  latestVaultId: string | null;
  activeVault: VaultState | null;
  activePtAddress: `0x${string}`;
  activeYtAddress: `0x${string}`;
  isStale: boolean;

  setUserAddress: (address: string | null) => void;
  setActiveVault: (vaultId: string) => void;
  clearOverride: () => void;
  recompute: () => void;
  getActiveVault: () => VaultState | null;
}

function vaultPtAddress(vault: VaultState | null): `0x${string}` {
  if (vault?.pt) return vault.pt as `0x${string}`;
  return TOKEN_ADDRESSES.PT;
}

function vaultYtAddress(vault: VaultState | null): `0x${string}` {
  if (vault?.yt) return vault.yt as `0x${string}`;
  return TOKEN_ADDRESSES.YT;
}

function collectUserPositions() {
  return Object.values(useDepositsStore.getState().vaults)
    .map((vault) => vault.userPosition)
    .filter((position): position is NonNullable<typeof position> => position !== null);
}

function collectVaultStates() {
  return Object.values(useDepositsStore.getState().vaults)
    .map((vault) => vault.state)
    .filter((state): state is VaultState => state !== null);
}

export const useActiveVaultStore = create<ActiveVaultState>()(
  subscribeWithSelector((set, get) => ({
    manualOverrideId: null,
    userAddress: null,
    activeVaultId: null,
    latestVaultId: null,
    activeVault: null,
    activePtAddress: TOKEN_ADDRESSES.PT,
    activeYtAddress: TOKEN_ADDRESSES.YT,
    isStale: false,

    setUserAddress: (address) => {
      set({ userAddress: address });
      get().recompute();
    },

    setActiveVault: (vaultId) => {
      set({ manualOverrideId: vaultId });
      get().recompute();
    },

    clearOverride: () => {
      set({ manualOverrideId: null });
      get().recompute();
    },

    recompute: () => {
      const vaultStates = collectVaultStates();
      const latestVault = pickLatestVault(vaultStates);
      const latestVaultId = latestVault?.id ?? null;
      const activeVaultId = pickActiveVaultId(
        vaultStates,
        collectUserPositions(),
        get().manualOverrideId
      );

      const activeVault =
        activeVaultId !== null
          ? (vaultStates.find((vault) => vault.id === activeVaultId) ?? null)
          : null;

      set({
        activeVaultId,
        latestVaultId,
        activeVault,
        activePtAddress: vaultPtAddress(activeVault),
        activeYtAddress: vaultYtAddress(activeVault),
        isStale:
          activeVaultId !== null && latestVaultId !== null && activeVaultId !== latestVaultId,
      });
    },

    getActiveVault: () => get().activeVault,
  }))
);

useDepositsStore.subscribe((state, prevState) => {
  if (state.vaults !== prevState.vaults) {
    useActiveVaultStore.getState().recompute();
  }
});

export function useActiveVault() {
  const activeVaultId = useActiveVaultStore((state) => state.activeVaultId);
  const latestVaultId = useActiveVaultStore((state) => state.latestVaultId);
  const vault = useActiveVaultStore((state) => state.activeVault);
  const activePtAddress = useActiveVaultStore((state) => state.activePtAddress);
  const activeYtAddress = useActiveVaultStore((state) => state.activeYtAddress);
  const isStale = useActiveVaultStore((state) => state.isStale);

  return {
    vault,
    vaultId: activeVaultId,
    latestVaultId,
    pt: activePtAddress,
    yt: activeYtAddress,
    isStale,
    isLatest: activeVaultId !== null && activeVaultId === latestVaultId,
  };
}
