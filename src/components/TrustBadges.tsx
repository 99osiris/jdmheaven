import React from 'react';
import { Shield, Award, Users, Clock, CheckCircle, Truck } from 'lucide-react';
import { Card } from './ui/Card';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
}

const badges: TrustBadge[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Verified Vehicles',
    description: 'All vehicles undergo comprehensive inspection',
    stat: '100%',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: '5+ Years Experience',
    description: 'Trusted JDM import specialists',
    stat: '500+',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Satisfied Customers',
    description: 'Join hundreds of happy JDM owners',
    stat: '500+',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'EU Compliant',
    description: 'Full compliance & registration support',
    stat: '100%',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Fast Shipping',
    description: '20-45 days from Japan to your door',
    stat: '20-45',
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Transparent Pricing',
    description: 'No hidden fees, all costs upfront',
    stat: '100%',
  },
];

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-16 bg-midnight-light border-y border-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-zen font-bold mb-4">Why Choose JDM HEAVEN?</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We're committed to providing the best JDM import experience with transparency, quality, and trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, idx) => (
            <Card
              key={idx}
              variant="bordered"
              padding="md"
              className="text-center hover:border-racing-red transition-fast group"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-racing-red-alpha rounded-none mb-4 text-racing-red group-hover:bg-racing-red group-hover:text-white transition-fast">
                  {badge.icon}
                </div>
                {badge.stat && (
                  <div className="text-3xl font-zen font-bold text-racing-red mb-2">
                    {badge.stat}
                  </div>
                )}
                <h3 className="text-xl font-zen font-bold mb-2">{badge.title}</h3>
                <p className="text-sm text-text-secondary">{badge.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

