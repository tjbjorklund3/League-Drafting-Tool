import { Role } from '../types';
import championRoles from '../data/championRoles.json';

export function getChampionRoles(championId: string): Role[] {
  if (championId === '-1') return [];
  return championRoles[championId] || ['TOP'];
}

export function getChampionsByRole(role: Role): string[] {
  return Object.entries(championRoles)
    .filter(([_, roles]) => roles.includes(role))
    .map(([champion]) => champion)
    .sort();
}

export function isChampionViableInRole(championId: string, role: Role): boolean {
  if (championId === '-1') return false;
  const roles = getChampionRoles(championId);
  return roles.includes(role);
}

// Get all roles a champion is played in with their play rates
export function getChampionRoleStats(championId: string): Record<Role, number> {
  // This would be expanded with actual play rate data from the API
  const roles = getChampionRoles(championId);
  return {
    TOP: roles.includes('TOP') ? 1 : 0,
    JUNGLE: roles.includes('JUNGLE') ? 1 : 0,
    MID: roles.includes('MID') ? 1 : 0,
    ADC: roles.includes('ADC') ? 1 : 0,
    SUPPORT: roles.includes('SUPPORT') ? 1 : 0
  };
}