import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define and export a type for the Folierer data structure
export type Folierer = {
  id: string;
  logo: string;
  name: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  location: string;
  phone: string;
  profileUrl: string;
};

type FoliererCardProps = {
  folierer: Folierer;
};

export function FoliererCard({ folierer }: FoliererCardProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(folierer.rating);
    const halfStar = folierer.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }
    if (halfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line"></i>);
    }
    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Image
          src={folierer.logo}
          alt={folierer.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
        />
        <div>
          <h3 className="font-bold text-lg">{folierer.name}</h3>
          <div className="flex items-center">
            <div className="flex text-yellow-400">{renderStars()}</div>
            <span className="text-sm text-gray-600 ml-1">({folierer.reviews})</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3 flex-grow">{folierer.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {folierer.tags.map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-600 space-y-2 mb-4">
        <div className="flex items-center">
          <i className="ri-map-pin-line mr-2 w-4 text-center"></i>
          <span>{folierer.location}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-phone-line mr-2 w-4 text-center"></i>
          <span>{folierer.phone}</span>
        </div>
      </div>
      <Button asChild className="w-full mt-auto bg-primary hover:bg-primary/90 text-white !rounded-button font-medium whitespace-nowrap">
        <Link href={folierer.profileUrl}>Profil ansehen</Link>
      </Button>
    </div>
  );
}
