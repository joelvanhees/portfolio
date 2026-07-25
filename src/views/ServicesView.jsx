import { useState } from 'react';
import SkillNetwork from '../components/SkillNetwork';
import RoleSwitch from '../components/RoleSwitch';
import { networkGroups } from '../content/services';

const ServicesView = ({ darkMode }) => {
  const [activeRole, setActiveRole] = useState(null);

  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-14 md:pb-40">
      <div data-reveal className="flex flex-col md:flex-row justify-between items-end mb-5 md:mb-12">
        <h1 className="text-[12vw] md:text-9xl font-rubik font-bold w-full break-words uppercase">
          <span className="glitch-hover cursor-default block">NETWORK_</span>
        </h1>
        <p className="font-meta text-sm opacity-60 text-right max-w-xs mt-4 md:mt-0">
          Interconnected disciplines forming a holistic design system.
        </p>
      </div>

      {/* The columns carry the reveal rather than the grid, so the grid keeps
          its own resting opacity untouched. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5 md:mb-12 opacity-80 font-meta text-xs uppercase">
        {networkGroups.map((group, i) => (
          <div data-reveal style={{ '--reveal-delay': `${i * 60}ms` }} key={group.title}>
            <h4 className="border-b border-current pb-2 mb-2 font-bold">{group.title}</h4>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Same control as the home page, driving the same map. */}
      <div data-reveal className="mb-6">
        <RoleSwitch darkMode={darkMode} activeRole={activeRole} onChange={setActiveRole} />
      </div>

      <SkillNetwork darkMode={darkMode} activeRole={activeRole} />
    </div>
  );
};

export default ServicesView;
