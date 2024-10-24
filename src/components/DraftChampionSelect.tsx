import React from 'react';
import { Search } from 'lucide-react';
import { Champion, Role } from '../types';
import { getChampionImageUrl } from '../services/championService';
import { RoleFilter } from './RoleFilter';

interface Props {
  onSelect: (champion: Champion) => void;
  selectedChampions: Champion[];
  champions: Champion[];
  selectedChampion: Champion | null;
}

const roles: Role[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

export function DraftChampionSelect({
  onSelect,
  selectedChampions,
  champions,
  selectedChampion
}: Props) {
  const [search, setSearch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [version, setVersion] = React.useState<string>('');

  React.useEffect(() => {
    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(res => res.json())
      .then(versions => setVersion(versions[0]));
  }, []);

  const filteredChampions = React.useMemo(() => {
    return champions.filter(c => {
      // If there's a search term, it takes priority over role filter
      if (search) {
        return c.name.toLowerCase().includes(search.toLowerCase());
      }
      
      // If no search term but role is selected, filter by role
      if (selectedRole) {
        return c.roles.includes(selectedRole);
      }
      
      // If no search and no role selected, show all champions
      return true;
    });
  }, [search, selectedRole, champions]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg pl-10"
            placeholder="Search champions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <RoleFilter
          selectedRole={selectedRole}
          onRoleSelect={setSelectedRole}
        />
      </div>

      <div className="champion-grid h-[480px] overflow-y-auto">
        {filteredChampions.map(champion => {
          const isPicked = selectedChampions.some(c => c.id === champion.id);
          const isActive = selectedChampion?.id === champion.id;
          const isNone = champion.id === '-1';

          return (
            <button
              key={champion.id}
              onClick={() => !isPicked && onSelect(champion)}
              className={`champion-grid-item rounded-lg transition-all relative
                ${isPicked && !isNone ? 'grayscale opacity-50' : 'hover:bg-gray-700'}
                ${isActive ? 'ring-2 ring-yellow-400 hover:ring-yellow-400' : ''}
                ${isPicked && !isNone ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {version && (
                <img
                  src={getChampionImageUrl(version, champion.id)}
                  alt={champion.name}
                  className="w-full aspect-square object-cover rounded-lg"
                  draggable={false}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}