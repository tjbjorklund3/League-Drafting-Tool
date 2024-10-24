import React from 'react';
import { Role } from '../types';
import { Sword, TreePine, Wand, Target, Heart } from 'lucide-react';

interface Props {
  selectedRole: Role | null;
  onRoleSelect: (role: Role | null) => void;
  showAllOption?: boolean;
}

const roleIcons: Record<Role, React.ReactNode> = {
  TOP: <Sword size={20} />,
  JUNGLE: <TreePine size={20} />,
  MID: <Wand size={20} />,
  ADC: <Target size={20} />,
  SUPPORT: <Heart size={20} />
};

const roleNames: Record<Role, string> = {
  TOP: 'Top',
  JUNGLE: 'Jungle',
  MID: 'Mid',
  ADC: 'ADC',
  SUPPORT: 'Support'
};

export function RoleFilter({ selectedRole, onRoleSelect, showAllOption = true }: Props) {
  return (
    <div className="flex gap-2">
      {showAllOption && (
        <button
          onClick={() => onRoleSelect(null)}
          className={`px-3 py-1 rounded transition-colors ${
            selectedRole === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
      )}
      
      {Object.entries(roleIcons).map(([role, icon]) => (
        <button
          key={role}
          onClick={() => onRoleSelect(role as Role)}
          className={`px-3 py-1 rounded flex items-center gap-2 transition-colors ${
            role === selectedRole
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title={roleNames[role as Role]}
        >
          {icon}
          <span className="hidden sm:inline">{roleNames[role as Role]}</span>
        </button>
      ))}
    </div>
  );
}