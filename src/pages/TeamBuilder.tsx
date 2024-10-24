import React from 'react';
import { ChampionSelect } from '../components/ChampionSelect';
import { TeamAnalysis } from '../components/TeamAnalysis';
import { Champion, Role } from '../types';
import { Sword, X } from 'lucide-react';
import { getAllChampions, getGameVersion, getChampionImageUrl } from '../services/championService';

const roles: Role[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

export default function TeamBuilder() {
  const [selectedRole, setSelectedRole] = React.useState<Role>('TOP');
  const [team, setTeam] = React.useState<(Champion | null)[]>(Array(5).fill(null));
  const [champions, setChampions] = React.useState<Champion[]>([]);
  const [version, setVersion] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [selectedChampion, setSelectedChampion] = React.useState<Champion | null>(null);
  
  React.useEffect(() => {
    const initializeData = async () => {
      try {
        const [gameVersion, allChampions] = await Promise.all([
          getGameVersion(),
          getAllChampions()
        ]);
        setVersion(gameVersion);
        setChampions(allChampions);
      } catch (error) {
        console.error('Failed to load champion data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleChampionSelect = (champion: Champion) => {
    if (selectedChampion) {
      const roleIndex = roles.indexOf(selectedRole);
      const newTeam = [...team];
      const oldRoleIndex = team.findIndex(champ => champ?.id === selectedChampion.id);
      
      if (oldRoleIndex !== -1) {
        newTeam[oldRoleIndex] = null;
      }
      newTeam[roleIndex] = champion;
      setTeam(newTeam);
      setSelectedChampion(null);
    } else {
      const roleIndex = roles.indexOf(selectedRole);
      const newTeam = [...team];
      newTeam[roleIndex] = champion;
      setTeam(newTeam);
    }
  };

  const handleRoleClick = (clickedRole: Role, index: number) => {
    if (selectedChampion) {
      const newTeam = [...team];
      const oldRoleIndex = team.findIndex(champ => champ?.id === selectedChampion.id);
      
      if (oldRoleIndex !== -1) {
        newTeam[oldRoleIndex] = team[index];
      }
      newTeam[index] = selectedChampion;
      
      setTeam(newTeam);
      setSelectedChampion(null);
    } else {
      if (team[index]) {
        setSelectedChampion(team[index]);
      }
      setSelectedRole(clickedRole);
    }
  };

  const removeChampion = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
    setSelectedChampion(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading champion data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Sword size={32} className="text-blue-400" />
        <h1 className="text-3xl font-bold">Team Builder</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="grid grid-cols-5 gap-4 mb-6">
              {team.map((champion, index) => (
                <div key={index} className="relative">
                  <div 
                    onClick={() => handleRoleClick(roles[index], index)}
                    className={`bg-gray-700 p-2 rounded-lg aspect-square flex items-center justify-center hover:bg-gray-600 transition-colors w-full cursor-pointer ${
                      selectedRole === roles[index] ? 'ring-2 ring-blue-500' : ''
                    } ${selectedChampion && !champion ? 'ring-2 ring-green-500' : ''} 
                    ${champion?.id === selectedChampion?.id ? 'ring-2 ring-yellow-500' : ''}`}
                  >
                    {champion ? (
                      <div className="relative w-full">
                        {version && (
                          <>
                            <img
                              src={getChampionImageUrl(version, champion.id)}
                              alt={champion.name}
                              className={`w-full rounded-lg ${champion.id === selectedChampion?.id ? 'opacity-75' : ''}`}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeChampion(index);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                              aria-label={`Remove ${champion.name}`}
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <p className="text-center mt-2 text-sm">{champion.name}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">{roles[index]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <ChampionSelect
              role={selectedRole}
              onSelect={handleChampionSelect}
              selectedChampions={team}
              champions={champions}
              onClose={() => {}}
            />
          </div>
        </div>

        <div>
          <TeamAnalysis team={team} />
        </div>
      </div>
    </div>
  );
}