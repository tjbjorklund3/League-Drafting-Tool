export interface Champion {
  id: string;
  name: string;
  roles: Role[];
  damageType: DamageType[];
  tags: ChampionTag[];
}

export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
export type DamageType = 'PHYSICAL' | 'MAGIC' | 'TRUE';
export type ChampionTag = 'Tank' | 'Fighter' | 'Mage' | 'Assassin' | 'Marksman' | 'Support' | 'Engage' | 'Poke' | 'Split Push';

export interface TeamComp {
  champions: (Champion | null)[];
  role: Role;
}

export interface DraftState {
  bans: (Champion | null)[];
  picks: (Champion | null)[];
  alternates: (Champion | null)[][];
}

export interface SelectedSlot {
  team: 'blue' | 'red';
  type: 'ban' | 'pick' | 'alternate';
  index: number;
  altIndex?: number;
}

export interface DragData {
  champion: Champion;
  sourceSlot: SelectedSlot;
}