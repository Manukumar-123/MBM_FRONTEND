export default function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 flex flex-col justify-between">
      <div className="text-[13px] text-[#8a8a98]">{label}</div>
      <div>
        <div className="font-serif text-[26px] text-white mt-3">{value}</div>
        {delta && <div className="text-[12px] text-[#6f6f7e] mt-1">{delta}</div>}
      </div>
    </div>
  );
}
