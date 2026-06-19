import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
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
  activePtAddress: `0x${string}` | null;
  activeYtAddress: `0x${string}` | null;
  isStale: boolean;

  setUserAddress: (address: string | null) => void;
  setActiveVault: (vaultId: string) => void;
  clearOverride: () => void;
  recompute: () => void;
}

export const useActiveVaultStore = create<ActiveVaultState>()(
  subscribeWithSelector((set, get) => ({
    manualOverrideId: null,
    userAddress: null,
    activeVaultId: null,
    latestVaultId: null,
    activeVault: null,
    activePtAddress: null,
    activeYtAddress: null,
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
      const depositsState = useDepositsStore.getState();

      const vaultStates = Object.values(depositsState.vaults)
        .map((vault) => vault.state)
        .filter((state): state is VaultState => state !== null);

      const userPositions = Object.values(depositsState.vaults)
        .map((vault) => vault.userPosition)
        .filter((position): position is NonNullable<typeof position> => position !== null);

      const latestVault = pickLatestVault(vaultStates);
      const latestVaultId = latestVault?.id ?? null;
      const activeVaultId = pickActiveVaultId(vaultStates, userPositions, get().manualOverrideId);

      const activeVault =
        activeVaultId !== null
          ? (vaultStates.find((vault) => vault.id === activeVaultId) ?? null)
          : null;

      set({
        activeVaultId,
        latestVaultId,
        activeVault,
        activePtAddress: activeVault?.pt ? (activeVault.pt as `0x${string}`) : null,
        activeYtAddress: activeVault?.yt ? (activeVault.yt as `0x${string}`) : null,
        isStale:
          activeVaultId !== null && latestVaultId !== null && activeVaultId !== latestVaultId,
      });
    },
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
