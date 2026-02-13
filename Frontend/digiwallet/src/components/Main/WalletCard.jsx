export default function WalletCard({ card }) {
  return (
    <div
      className="rounded-2xl p-5 text-white relative overflow-hidden min-h-[180px] flex flex-col justify-between"
      style={{
        background: card.gradient || "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-4 -translate-x-4" />

      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-xs font-medium opacity-80">{card.type}</span>
        <span className="text-sm font-bold tracking-wider">{card.network}</span>
      </div>

      {/* Card number */}
      <p className="text-base font-mono tracking-widest relative z-10 my-4">
        •••• •••• •••• {card.lastFour}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-[10px] opacity-60 uppercase">Card Holder</p>
          <p className="text-sm font-medium">{card.holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] opacity-60 uppercase">Expires</p>
          <p className="text-sm font-medium">{card.expiry}</p>
        </div>
      </div>
    </div>
  );
}
