import { Champion } from './index';

export interface DraftRoom {
  id: string;
  blueTeam: string;
  redTeam: string;
  numberOfGames: number;
  fearlessDraft: boolean;
  status: DraftStatus;
  currentGame: number;
  currentPhase: number;
  blueReady: boolean;
  redReady: boolean;
  games: DraftGame[];
  currentTimer: number;
}

export interface DraftGame {
  gameNumber: number;
  blueBans: (Champion | null)[];
  redBans: (Champion | null)[];
  bluePicks: (Champion | null)[];
  redPicks: (Champion | null)[];
  blueHover: Champion | null;
  redHover: Champion | null;
  swapRequest: SwapRequest | null;
  bannedChampions: Set<string>;
  pickedChampions: Set<string>;
}

export interface SwapRequest {
  team: 'blue' | 'red';
  originalPhase: number;
  championId: string;
  newPosition: number;
  pending: boolean;
}

export type DraftStatus = 'waiting' | 'ready' | 'in_progress' | 'completed';

export type DraftViewType = 'blue' | 'red' | 'spectator';

export const DRAFT_ORDER = [
  { team: 'blue', type: 'ban' },   // 0
  { team: 'red', type: 'ban' },    // 1
  { team: 'blue', type: 'ban' },   // 2
  { team: 'red', type: 'ban' },    // 3
  { team: 'blue', type: 'ban' },   // 4
  { team: 'red', type: 'ban' },    // 5
  { team: 'blue', type: 'pick' },  // 6
  { team: 'red', type: 'pick' },   // 7
  { team: 'red', type: 'pick' },   // 8
  { team: 'blue', type: 'pick' },  // 9
  { team: 'blue', type: 'pick' },  // 10
  { team: 'red', type: 'pick' },   // 11
  { team: 'red', type: 'ban' },    // 12
  { team: 'blue', type: 'ban' },   // 13
  { team: 'red', type: 'ban' },    // 14
  { team: 'blue', type: 'ban' },   // 15
  { team: 'red', type: 'pick' },   // 16
  { team: 'blue', type: 'pick' },  // 17
  { team: 'blue', type: 'pick' },  // 18
  { team: 'red', type: 'pick' }    // 19
];

export const DRAFT_TIMER = 30; // seconds