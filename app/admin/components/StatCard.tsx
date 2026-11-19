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
    <div className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 max-md:p-4 flex flex-col justify-between">
      <div className="text-[13px] text-[#8a8a98]">{label}</div>
      <div>
        <div className="font-serif text-[26px] max-md:text-[22px] text-white mt-3">{value}</div>
        {delta && <div className="text-[12px] text-[#6f6f7e] mt-1">{delta}</div>}
      </div>
    </div>
  );
}
