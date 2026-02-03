import SkillNetwork from '../components/SkillNetwork';
import { networkGroups } from '../content/services';

const ServicesView = ({ darkMode }) => {
  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto pb-40">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <h1 className="text-[12vw] md:text-9xl font-rubik font-bold w-full break-words uppercase">
          <span className="glitch-hover cursor-default block">NETWORK_</span>
        </h1>
        <p className="font-mono text-sm opacity-60 text-right max-w-xs mt-4 md:mt-0">
          Interconnected disciplines forming a holistic design system.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 opacity-80 font-mono text-xs uppercase">
        {networkGroups.map((group) => (
          <div key={group.title}>
            <h4 className="border-b border-current pb-2 mb-2 font-bold">{group.title}</h4>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SkillNetwork darkMode={darkMode} />
    </div>
  );
};

export default ServicesView;
