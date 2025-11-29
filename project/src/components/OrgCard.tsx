import { Heart, MapPin, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../lib/roundup';

interface Organization {
  id: string;
  name: string;
  category: string;
  description: string;
  logo_url: string | null;
  location: string | null;
  verified: boolean;
}

interface OrgCardProps {
  organization: Organization;
  totalDonated?: number;
  onSelect?: (org: Organization) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (orgId: string) => void;
}

export default function OrgCard({
  organization,
  totalDonated,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: OrgCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {organization.logo_url ? (
            <img
              src={organization.logo_url}
              alt={organization.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            organization.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {organization.name}
            </h3>
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(organization.id);
                }}
                className="flex-shrink-0"
              >
                <Heart
                  size={20}
                  className={`${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  } hover:text-red-500 transition-colors`}
                />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              {organization.category}
            </span>
            {organization.verified && (
              <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{organization.description}</p>
          <div className="flex items-center justify-between">
            {organization.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={14} />
                <span>{organization.location}</span>
              </div>
            )}
            {totalDonated !== undefined && (
              <div className="text-sm font-semibold text-blue-600">
                {formatCurrency(totalDonated)} donated
              </div>
            )}
          </div>
        </div>
      </div>
      {onSelect && (
        <button
          onClick={() => onSelect(organization)}
          className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>Learn More</span>
          <ExternalLink size={16} />
        </button>
      )}
    </div>
  );
}
