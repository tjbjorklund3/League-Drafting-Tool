import React from 'react';
import { Search, X, Sword, TreePine, Wand, Target, Heart } from 'lucide-react';
import { Champion, Role } from '../types';
import { getGameVersion, getChampionImageUrl } from '../services/championService';

interface Props {
  role: Role;
  onSelect: (champion: Champion) => void;
  selectedChampions: (Champion | null)[];
  champions: Champion[];
  onClose: () => void;
}

const roleIcons: Record<Role, React.ReactNode> = {
  TOP: <Sword size={20} />,
  JUNGLE: <TreePine size={20} />,
  MID: <Wand size={20} />,
  ADC: <Target size={20} />,
  SUPPORT: <Heart size={20} />
};

export function ChampionSelect({ role, onSelect, selectedChampions, champions, onClose }: Props) {
  const [search, setSearch] = React.useState('');
  const [version, setVersion] = React.useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<Role | null>(role);
  
  React.useEffect(() => {
    getGameVersion().then(setVersion);
  }, []);
  
  const filteredChampions = React.useMemo(() => {
    return champions
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .filter(c => !selectedChampions.some(sc => sc?.id === c.id))
      .filter(c => selectedRoleFilter ? c.roles.includes(selectedRoleFilter) : true);
  }, [search, selectedChampions, champions, selectedRoleFilter]);

  return (
    <div className="relative bg-gray-900 p-4 rounded-lg mt-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Select Champion for {role}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg pl-10"
            placeholder="Search champions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex gap-2">
          {Object.entries(roleIcons).map(([roleKey, icon]) => (
            <button
              key={roleKey}
              onClick={() => setSelectedRoleFilter(roleKey as Role === selectedRoleFilter ? null : roleKey as Role)}
              className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                roleKey as Role === selectedRoleFilter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto mt-4 pr-2 champion-grid"
      >
        {filteredChampions.map(champion => (
          <button
            key={champion.id}
            onClick={() => onSelect(champion)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group relative"
          >
            {version && (
              <img 
                src={getChampionImageUrl(version, champion.id)}
                alt={champion.name}
                className="w-12 h-12 mx-auto rounded-full"
                loading="lazy"
              />
            )}
            <p className="text-sm mt-1 text-center truncate">{champion.name}</p>
            {champion.roles.includes(role) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}