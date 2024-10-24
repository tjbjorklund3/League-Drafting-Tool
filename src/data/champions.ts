import { Champion } from '../types';

export const champions: Champion[] = [
  {
    id: "Aatrox",
    name: "Aatrox",
    roles: ["TOP"],
    damageType: ["PHYSICAL"],
    tags: ["Fighter", "Tank"]
  },
  {
    id: "Ahri",
    name: "Ahri",
    roles: ["MID"],
    damageType: ["MAGIC"],
    tags: ["Mage", "Assassin"]
  },
  // Add more champions as needed
  {
    id: "Jinx",
    name: "Jinx",
    roles: ["ADC"],
    damageType: ["PHYSICAL"],
    tags: ["Marksman"]
  },
  {
    id: "Leona",
    name: "Leona",
    roles: ["SUPPORT"],
    damageType: ["MAGIC"],
    tags: ["Tank", "Support", "Engage"]
  }
];