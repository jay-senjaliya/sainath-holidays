import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default Leaflet marker icons in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export function PackageMap() {
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages', 'map'],
    queryFn: async () => {
      const res = await api.get('/packages/map');
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="h-[500px] w-full bg-slate-100 flex items-center justify-center animate-pulse rounded-2xl">Loading Map...</div>;
  }

  // Default center: India/Central
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border relative z-0">
      <MapContainer center={defaultCenter} zoom={4} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {packages?.map((pkg: any) => (
          <Marker key={pkg.id} position={[pkg.latitude, pkg.longitude]}>
            <Popup className="min-w-[200px]">
              <div className="p-0 m-0">
                {pkg.primaryImageUrl && (
                  <img 
                    src={pkg.primaryImageUrl} 
                    alt={pkg.title} 
                    className="w-full h-24 object-cover rounded-t-md mb-2"
                  />
                )}
                <h3 className="font-bold text-base leading-tight">{pkg.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{pkg.location}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-primary">${pkg.price}</span>
                  <Link 
                    to={`/packages/${pkg.id}`}
                    className="bg-primary text-white text-xs px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
