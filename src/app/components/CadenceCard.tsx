interface CadenceCardProps {
  month: string;
  phase: string;
  description: string;
}

export function CadenceCard({ month, phase, description }: CadenceCardProps) {
  return (
    <div className="bg-white border-2 border-[#0C0C0A] p-6">
      <div className="text-sm font-mono uppercase mb-2 text-[#EBBD06] font-black">{month}</div>
      <h3 className="text-2xl mb-3 uppercase tracking-tight">{phase}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
