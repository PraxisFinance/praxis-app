/** Placeholder types for the future Quests tab. */

export interface QuestsSliceState {
  // Reserved for quest list, progress, and rewards.
}

export interface QuestsSliceActions {
  resetQuests: () => void;
}

export type QuestsSlice = QuestsSliceState & QuestsSliceActions;
