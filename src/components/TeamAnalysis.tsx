import React from 'react';
import { Champion, ChampionTag, DamageType } from '../types';
import { Shield, Swords, Zap, Users, Clock } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  team: (Champion | null)[];
}

interface TeamStrength {
  name: string;
  value: number;
}

export function TeamAnalysis({ team }: Props) {
  const damageProfile = React.useMemo(() => {
    const damage = { PHYSICAL: 0, MAGIC: 0, TRUE: 0 };
    team.forEach(champion => {
      if (champion) {
        champion.damageType.forEach(type => {
          damage[type]++;
        });
      }
    });
    const total = damage.PHYSICAL + damage.MAGIC + damage.TRUE;
    return {
      raw: damage,
      percentage: {
        PHYSICAL: total ? Math.round((damage.PHYSICAL / total) * 100) : 0,
        MAGIC: total ? Math.round((damage.MAGIC / total) * 100) : 0,
        TRUE: total ? Math.round((damage.TRUE / total) * 100) : 0
      }
    };
  }, [team]);

  const teamComposition = React.useMemo(() => {
    const comp: Record<ChampionTag, number> = {
      Tank: 0, Fighter: 0, Mage: 0, Assassin: 0, Marksman: 0, 
      Support: 0, Engage: 0, Poke: 0, 'Split Push': 0
    };
    
    team.forEach(champion => {
      if (champion) {
        champion.tags.forEach(tag => {
          comp[tag]++;
        });
      }
    });
    return comp;
  }, [team]);

  const teamStrengthData = React.useMemo(() => {
    const calculateStrength = (phase: 'early' | 'mid' | 'late'): number => {
      let strength = 0;
      team.forEach(champion => {
        if (champion) {
          if (phase === 'early' && (champion.tags.includes('Assassin') || champion.tags.includes('Support'))) strength += 2;
          if (phase === 'mid' && (champion.tags.includes('Mage') || champion.tags.includes('Fighter'))) strength += 2;
          if (phase === 'late' && (champion.tags.includes('Marksman') || champion.tags.includes('Tank'))) strength += 2;
          strength += 1;
        }
      });
      return Math.min(10, (strength / team.length) * 5);
    };

    return [
      { name: 'Early Game', value: calculateStrength('early') },
      { name: 'Teamfight', value: teamComposition.Tank + teamComposition.Engage },
      { name: 'Split Push', value: teamComposition['Split Push'] + teamComposition.Fighter },
      { name: 'Pick Potential', value: teamComposition.Assassin + teamComposition.Mage },
      { name: 'Late Game', value: calculateStrength('late') },
    ];
  }, [team, teamComposition]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-6">
      <h3 className="text-xl font-bold">Team Analysis</h3>
      
      <div>
        <h4 className="flex items-center gap-2 mb-3">
          <Swords className="text-red-400" size={20} />
          <span>Damage Distribution</span>
        </h4>
        <div className="h-6 w-full bg-gray-700 rounded-full overflow-hidden flex">
          <div 
            className="bg-red-500 h-full transition-all"
            style={{ width: `${damageProfile.percentage.PHYSICAL}%` }}
          >
            <span className="text-xs px-2 leading-6 inline-block">
              {damageProfile.percentage.PHYSICAL}% P
            </span>
          </div>
          <div 
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${damageProfile.percentage.MAGIC}%` }}
          >
            <span className="text-xs px-2 leading-6 inline-block">
              {damageProfile.percentage.MAGIC}% M
            </span>
          </div>
          <div 
            className="bg-white h-full transition-all"
            style={{ width: `${damageProfile.percentage.TRUE}%` }}
          >
            <span className="text-xs px-2 leading-6 inline-block text-gray-900">
              {damageProfile.percentage.TRUE}% T
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="flex items-center gap-2 mb-3">
          <Clock className="text-yellow-400" size={20} />
          <span>Team Strength</span>
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamStrengthData}>
              <PolarGrid stroke="#4B5563" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Radar
                name="Team Strength"
                dataKey="value"
                stroke="#60A5FA"
                fill="#3B82F6"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="flex items-center gap-2 mb-3">
          <Users className="text-blue-400" size={20} />
          <span>Team Composition</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(teamComposition)
            .filter(([_, value]) => value > 0)
            .map(([tag, count]) => (
              <div key={tag} className="bg-gray-700 p-2 rounded">
                <div className="text-sm">{tag}</div>
                <div className="text-xl font-bold">{count}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}