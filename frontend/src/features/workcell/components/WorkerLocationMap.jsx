export default function WorkerLocationMap({ lat, lng }) {
  if (lat == null || lng == null) return null;
  const delta = 0.01;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat},${lng}`;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 mt-2">
      <iframe title="Worker location" src={src} className="w-full h-48 border-0" loading="lazy" />
    </div>
  );
}