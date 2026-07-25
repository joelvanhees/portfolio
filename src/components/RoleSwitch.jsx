import { skillRoles } from '../content/skills';
import { playClickSound } from '../utils/clickSound';

/**
 * The role filter for the skill map. Exactly one role can be active, and
 * pressing the active one clears it back to the full overview.
 *
 * Shared by the home page and the network page so the two cannot drift apart.
 */
const RoleSwitch = ({ darkMode, activeRole, onChange, className = '' }) => (
  <div className={`flex flex-wrap gap-3 md:gap-4 ${className}`}>
    {skillRoles.map(({ id, label }) => {
      const isActive = activeRole === id;
      return (
        <button
          key={id}
          type="button"
          aria-pressed={isActive}
          onClick={() => {
            onChange(isActive ? null : id);
            playClickSound('click');
          }}
          className={`px-4 py-2 rounded-full text-sm uppercase transition-all duration-300 border cursor-pointer active:scale-95
            ${isActive
              ? (darkMode
                ? 'bg-[#C7FF2E] border-[#C7FF2E] text-black shadow-[0_0_15px_rgba(199,255,46,0.3)]'
                : 'bg-black border-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]')
              : (darkMode
                ? 'border-[#C7FF2E]/40 text-[#C7FF2E]/80 hover:text-[#C7FF2E] hover:border-[#C7FF2E] bg-transparent'
                : 'border-black/30 text-black/75 hover:text-black hover:border-black bg-transparent')
            }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default RoleSwitch;
