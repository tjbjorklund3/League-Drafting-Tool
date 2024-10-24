import { Champion, Role, DamageType, ChampionTag } from '../types';

interface DDragonChampion {
  id: string;
  key: string;
  name: string;
  tags: string[];
}

interface DDragonResponse {
  data: Record<string, DDragonChampion>;
}

const FALLBACK_VERSION = '14.21.1';

export async function getGameVersion(): Promise<string> {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) throw new Error('Failed to fetch game version');
    const versions = await response.json();
    return versions[0];
  } catch (error) {
    console.error('Error fetching game version:', error);
    return FALLBACK_VERSION;
  }
}

function mapChampionRoles(id: string, tags: string[]): Role[] {
  const roleMap: Record<string, Role[]> = {
    Aatrox: ['TOP'],
    Ahri: ['MID'],
    Jinx: ['ADC'],
    Leona: ['SUPPORT'],
  };

  if (roleMap[id]) return roleMap[id];

  const roles: Role[] = [];
  if (tags.includes('Marksman')) roles.push('ADC');
  if (tags.includes('Support')) roles.push('SUPPORT');
  if (tags.includes('Tank') || tags.includes('Fighter')) roles.push('TOP', 'JUNGLE');
  if (tags.includes('Mage') || tags.includes('Assassin')) roles.push('MID');
  
  return roles.length ? roles : ['TOP'];
}

function getDamageType(tags: string[]): DamageType[] {
  const damageTypes: DamageType[] = [];
  if (tags.includes('Marksman') || tags.includes('Fighter')) damageTypes.push('PHYSICAL');
  if (tags.includes('Mage')) damageTypes.push('MAGIC');
  if (tags.includes('Tank')) damageTypes.push('PHYSICAL', 'MAGIC');
  return damageTypes.length ? damageTypes : ['PHYSICAL'];
}

function mapChampionTags(tags: string[]): ChampionTag[] {
  const tagMap: Record<string, ChampionTag> = {
    Fighter: 'Fighter',
    Tank: 'Tank',
    Mage: 'Mage',
    Assassin: 'Assassin',
    Marksman: 'Marksman',
    Support: 'Support'
  };

  return tags
    .map(tag => tagMap[tag])
    .filter((tag): tag is ChampionTag => tag !== undefined);
}

export const NoneChampion: Champion = {
  id: '-1',
  name: 'None',
  roles: [],
  damageType: [],
  tags: []
};

export async function getAllChampions(): Promise<Champion[]> {
  try {
    const version = await getGameVersion();
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: DDragonResponse = await response.json();
    const champions = Object.values(data.data).map(champion => ({
      id: champion.id,
      name: champion.name,
      roles: mapChampionRoles(champion.id, champion.tags),
      damageType: getDamageType(champion.tags),
      tags: mapChampionTags(champion.tags)
    }));

    return [NoneChampion, ...champions];
  } catch (error) {
    console.error('Error fetching champions:', error);
    return [NoneChampion];
  }
}

export function getChampionImageUrl(version: string, championId: string): string {
  if (championId === '-1') {
    return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png';
  }
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
}

export function getChampionSplashUrl(championId: string): string {
  if (championId === '-1') {
    return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png';
  }
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`;
}