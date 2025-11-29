import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Compare, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Gauge, 
  Zap,
  Settings,
  Car,
  ChevronRight,
  Download,
  ExternalLink,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useAccount } from '../contexts/AccountContext';
import { analytics } from '../lib/analytics';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { CarCard } from '../components/CarCard';
import { toast } from '../components/Toast';
import type { Car } from '../types';

const CarDetailPage: React.FC = () => {
  const { reference_number } = useParams<{ reference_number: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, addToCart } = useAccount();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!reference_number) {
        setError('Invalid car reference');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cars = await api.cars.getAll();
        const foundCar = cars.find(c => c.reference_number === reference_number);
        
        if (!foundCar) {
          setError('Car not found');
          setLoading(false);
          return;
        }

        setCar(foundCar);
        addToRecentlyViewed(foundCar);
        analytics.carView(foundCar.id, `${foundCar.make} ${foundCar.model}`, foundCar.price);

        // Fetch similar cars
        fetchSimilarCars(foundCar);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details');
        analytics.error('Failed to load car details', `/inventory/${reference_number}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [reference_number, addToRecentlyViewed]);

  const fetchSimilarCars = async (currentCar: Car) => {
    try {
      setLoadingSimilar(true);
      const cars = await api.cars.getAll();
      
      // Find similar cars based on:
      // 1. Same make/model (different year)
      // 2. Similar price range (±20%)
      // 3. Similar specs
      const similar = cars
        .filter(c => c.id !== currentCar.id)
        .filter(c => {
          const sameMakeModel = c.make === currentCar.make && c.model === currentCar.model;
          const similarPrice = Math.abs(c.price - currentCar.price) / currentCar.price <= 0.2;
          const similarHP = Math.abs((c.horsepower || 0) - (currentCar.horsepower || 0)) <= 50;
          return sameMakeModel || (similarPrice && similarHP);
        })
        .slice(0, 4);
      
      setSimilarCars(similar);
    } catch (err) {
      console.error('Error fetching similar cars:', err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleWishlist = async () => {
    if (!car) return;
    const wasInWishlist = isInWishlist(car.id);
    await toggleWishlist(car);
    analytics.carWishlist(car.id, wasInWishlist ? 'remove' : 'add');
  };

  const handleAddToCart = async () => {
    if (!car) return;
    await addToCart(car, 'general');
    analytics.carInquiry(car.id, `${car.make} ${car.model}`, 'general');
  };

  const handleShare = async (method: 'native' | 'whatsapp' | 'email' | 'copy') => {
    if (!car) return;

    const shareUrl = `${window.location.origin}/inventory/${car.reference_number}`;
    const shareText = `Check out this ${car.year} ${car.make} ${car.model} for €${car.price.toLocaleString()} on JDM HEAVEN!`;

    try {
      switch (method) {
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: `${car.make} ${car.model}`,
              text: shareText,
              url: shareUrl,
            });
            analytics.carShare(car.id, 'native_share');
          }
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
          analytics.carShare(car.id, 'whatsapp');
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(`${car.make} ${car.model}`)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
          analytics.carShare(car.id, 'email');
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
          analytics.carShare(car.id, 'clipboard');
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleInquire = () => {
    if (!car) return;
    analytics.carInquiry(car.id, `${car.make} ${car.model}`, 'general');
    navigate(`/contact?car=${car.reference_number}`);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="pt-20 min-h-screen bg-midnight text-text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-zen mb-4">Car Not Found</h1>
          <p className="text-text-secondary mb-8">{error || 'The car you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/inventory')} variant="primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const mainImage = car.images?.find((img: any) => img.is_primary)?.url || car.images?.[0]?.url || '/placeholder-car.jpg';
  const allImages = car.images?.map((img: any) => img.url) || [mainImage];
  const isNew = car.created_at 
    ? new Date(car.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="pt-20 min-h-screen bg-midnight text-text-primary">
      {/* Breadcrumb */}
      <div className="bg-midnight-light border-b border-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-text-secondary hover:text-text-primary transition-fast">Home</Link>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
            <Link to="/inventory" className="text-text-secondary hover:text-text-primary transition-fast">Inventory</Link>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
            <span className="text-text-primary">{car.make} {car.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/inventory')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-video bg-charcoal cursor-pointer group"
              onClick={() => setShowLightbox(true)}
            >
              <img
                src={allImages[selectedImageIndex] || mainImage}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isNew && (
                <div className="absolute top-4 left-4 bg-success px-3 py-1 text-sm font-zen flex items-center gap-1">
                  <span>✨</span>
                  New Arrival
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlist();
                  }}
                  className={`p-2 rounded-none backdrop-blur-md transition ${
                    isInWishlist(car.id) ? 'bg-racing-red' : 'bg-black/50 hover:bg-racing-red'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(car.id) ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare('native');
                  }}
                  className="p-2 rounded-none bg-black/50 hover:bg-racing-red backdrop-blur-md transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(idx);
                    }}
                    className={`w-16 h-16 rounded-none border-2 transition ${
                      selectedImageIndex === idx
                        ? 'border-racing-red'
                        : 'border-transparent hover:border-charcoal'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Grid */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-video bg-charcoal border-2 transition ${
                      selectedImageIndex === idx
                        ? 'border-racing-red'
                        : 'border-transparent hover:border-charcoal'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Overview */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-zen font-bold mb-2">
                    {car.make} {car.model}
                  </h1>
                  <p className="text-2xl text-racing-red font-zen font-bold">
                    €{car.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-text-tertiary mt-1">Import costs not included</p>
                </div>
                <div className={`px-4 py-2 text-sm font-zen ${
                  car.status === 'available' ? 'bg-racing-red' :
                  car.status === 'in_transit' ? 'bg-warning' :
                  car.status === 'reserved' ? 'bg-info' :
                  'bg-charcoal'
                }`}>
                  {car.status?.replace(/_/g, ' ').toUpperCase() || 'AVAILABLE'}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{car.year}</span>
                </div>
                {car.mileage && (
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    <span>{car.mileage.toLocaleString()} km</span>
                  </div>
                )}
                {car.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{car.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>{car.horsepower} HP</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleInquire}
                variant="primary"
                fullWidth
                glow
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Inquire Now
              </Button>
              <Button
                onClick={() => navigate(`/comparison?add=${car.id}`)}
                variant="outline"
                fullWidth
                size="lg"
              >
                <Compare className="w-5 h-5" />
                Compare
              </Button>
            </div>

            {/* Share Options */}
            <div className="border-t border-charcoal pt-6">
              <p className="text-sm text-text-secondary mb-3">Share this car:</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleShare('whatsapp')}
                  variant="ghost"
                  size="sm"
                >
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleShare('email')}
                  variant="ghost"
                  size="sm"
                >
                  Email
                </Button>
                <Button
                  onClick={() => handleShare('copy')}
                  variant="ghost"
                  size="sm"
                >
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Key Specs Card */}
            <Card variant="bordered" padding="md">
              <h3 className="font-zen text-lg mb-4">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Engine:</span>
                  <p className="text-text-primary font-medium">{car.engine_type}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Power:</span>
                  <p className="text-text-primary font-medium">{car.horsepower} HP</p>
                </div>
                <div>
                  <span className="text-text-secondary">Transmission:</span>
                  <p className="text-text-primary font-medium">{car.transmission_type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Drivetrain:</span>
                  <p className="text-text-primary font-medium">{car.drivetrain_type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Handling:</span>
                  <p className="text-text-primary font-medium">
                    {car.handling === 'right' ? 'Right Hand Drive' : 'Left Hand Drive'}
                  </p>
                </div>
                <div>
                  <span className="text-text-secondary">Reference:</span>
                  <p className="text-text-primary font-medium">{car.reference_number}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Import Cost Calculator Section */}
        <div className="mb-12">
          <ImportCostCalculator car={car} />
        </div>

        {/* Vehicle History & Condition */}
        <div className="mb-12">
          <VehicleHistorySection car={car} />
        </div>

        {/* Full Specifications */}
        <div className="mb-12">
          <FullSpecificationsSection car={car} />
        </div>

        {/* Description */}
        {car.description && (
          <div className="mb-12">
            <Card variant="bordered" padding="lg">
              <h2 className="text-2xl font-zen font-bold mb-4">Description</h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </Card>
          </div>
        )}

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-zen font-bold">Similar Cars</h2>
              <Link
                to="/inventory"
                className="text-racing-red hover:text-racing-red-light transition-fast flex items-center gap-1 text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCars.map((similarCar) => (
                <CarCard key={similarCar.id} car={similarCar} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-light border-t border-charcoal p-4 z-50 lg:hidden">
        <div className="max-w-7xl mx-auto flex gap-4">
          <Button
            onClick={handleInquire}
            variant="primary"
            fullWidth
            glow
          >
            <ShoppingCart className="w-5 h-5" />
            Inquire Now
          </Button>
          <Button
            onClick={handleWishlist}
            variant={isInWishlist(car.id) ? 'primary' : 'outline'}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(car.id) ? 'fill-white' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-racing-red transition"
          >
            <span className="text-4xl">×</span>
          </button>
          <img
            src={allImages[selectedImageIndex] || mainImage}
            alt={`${car.make} ${car.model}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

// Import Cost Calculator Component
const ImportCostCalculator: React.FC<{ car: Car }> = ({ car }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>('DE');
  const [shippingMethod, setShippingMethod] = useState<'roro' | 'container'>('roro');
  const [calculated, setCalculated] = useState(false);
  const [costs, setCosts] = useState({
    base: car.price,
    shipping: 0,
    customs: 0,
    vat: 0,
    compliance: 0,
    registration: 0,
    total: 0,
  });

  const countries = [
    { code: 'DE', name: 'Germany', vat: 19, duty: 10 },
    { code: 'FR', name: 'France', vat: 20, duty: 10 },
    { code: 'IT', name: 'Italy', vat: 22, duty: 10 },
    { code: 'ES', name: 'Spain', vat: 21, duty: 10 },
    { code: 'NL', name: 'Netherlands', vat: 21, duty: 10 },
    { code: 'BE', name: 'Belgium', vat: 21, duty: 10 },
    { code: 'AT', name: 'Austria', vat: 20, duty: 10 },
    { code: 'CH', name: 'Switzerland', vat: 7.7, duty: 0 },
  ];

  const calculateCosts = () => {
    const country = countries.find(c => c.code === destination) || countries[0];
    const shipping = shippingMethod === 'roro' ? 2500 : 2000;
    const customs = (car.price + shipping) * (country.duty / 100);
    const vatBase = car.price + shipping + customs;
    const vat = vatBase * (country.vat / 100);
    const compliance = 1500; // EU compliance work
    const registration = 500;
    const total = car.price + shipping + customs + vat + compliance + registration;

    setCosts({
      base: car.price,
      shipping,
      customs,
      vat,
      compliance,
      registration,
      total,
    });
    setCalculated(true);
    analytics.importCalculator(destination, total);
  };

  const selectedCountry = countries.find(c => c.code === destination);

  return (
    <Card variant="elevated" padding="lg" glow>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-racing-red-alpha rounded-none">
          <Car className="w-6 h-6 text-racing-red" />
        </div>
        <div>
          <h2 className="text-2xl font-zen font-bold">Import Cost Calculator</h2>
          <p className="text-sm text-text-secondary">Calculate total import costs to your country</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Destination Country
          </label>
          <select
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setCalculated(false);
            }}
            className="w-full bg-midnight-light border border-charcoal text-text-primary px-4 py-2 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Shipping Method
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShippingMethod('roro');
                setCalculated(false);
              }}
              className={`flex-1 px-4 py-2 rounded-none border-2 transition-fast ${
                shippingMethod === 'roro'
                  ? 'border-racing-red bg-racing-red-alpha text-racing-red'
                  : 'border-charcoal text-text-secondary hover:border-racing-red'
              }`}
            >
              RoRo (Faster)
            </button>
            <button
              onClick={() => {
                setShippingMethod('container');
                setCalculated(false);
              }}
              className={`flex-1 px-4 py-2 rounded-none border-2 transition-fast ${
                shippingMethod === 'container'
                  ? 'border-racing-red bg-racing-red-alpha text-racing-red'
                  : 'border-charcoal text-text-secondary hover:border-racing-red'
              }`}
            >
              Container (Cheaper)
            </button>
          </div>
        </div>
      </div>

      {calculated && (
        <div className="mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Base Vehicle Price</span>
            <span className="text-text-primary font-medium">€{costs.base.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Shipping ({shippingMethod === 'roro' ? 'RoRo' : 'Container'})</span>
            <span className="text-text-primary font-medium">€{costs.shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Customs Duty ({selectedCountry?.duty}%)</span>
            <span className="text-text-primary font-medium">€{costs.customs.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">VAT ({selectedCountry?.vat}%)</span>
            <span className="text-text-primary font-medium">€{costs.vat.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">EU Compliance Work</span>
            <span className="text-text-primary font-medium">€{costs.compliance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Registration</span>
            <span className="text-text-primary font-medium">€{costs.registration.toLocaleString()}</span>
          </div>
          <div className="border-t border-charcoal pt-3 flex justify-between text-lg">
            <span className="font-zen font-bold">Total Import Cost</span>
            <span className="text-racing-red font-zen font-bold text-xl">
              €{costs.total.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={calculateCosts}
          variant="primary"
          fullWidth
          glow
        >
          Calculate Total Cost
        </Button>
        {calculated && (
          <Button
            onClick={() => navigate(`/contact?car=${car.reference_number}&quote=true`)}
            variant="outline"
            fullWidth
          >
            Get Detailed Quote
          </Button>
        )}
      </div>

      {calculated && (
        <div className="mt-6 p-4 bg-midnight-lighter rounded-none border border-charcoal">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-racing-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Estimated Timeline</p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Shipping: {shippingMethod === 'roro' ? '20-30' : '30-45'} days</li>
                <li>• Customs Clearance: 5-7 days</li>
                <li>• Compliance Work: 10-14 days</li>
                <li>• Total: {shippingMethod === 'roro' ? '35-51' : '45-66'} days</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// Vehicle History Section
const VehicleHistorySection: React.FC<{ car: Car }> = ({ car }) => {
  return (
    <Card variant="bordered" padding="lg">
      <h2 className="text-2xl font-zen font-bold mb-6">Vehicle History & Condition</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-zen text-lg mb-4">Condition Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Mileage:</span>
              <span className="text-text-primary font-medium">
                {car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Year:</span>
              <span className="text-text-primary font-medium">{car.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Location:</span>
              <span className="text-text-primary font-medium">{car.location || 'Japan'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Status:</span>
              <span className="text-text-primary font-medium">
                {car.status?.replace(/_/g, ' ') || 'Available'}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-zen text-lg mb-4">Additional Information</h3>
          <div className="space-y-3">
            <p className="text-text-secondary text-sm">
              Full vehicle history reports and inspection documents are available upon request.
              Contact us for detailed condition reports, auction sheets (if applicable), and service records.
            </p>
            <Button
              onClick={() => navigate(`/contact?car=${car.reference_number}&request=history`)}
              variant="outline"
              size="sm"
            >
              Request Full History
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Full Specifications Section
const FullSpecificationsSection: React.FC<{ car: Car }> = ({ car }) => {
  const [expanded, setExpanded] = useState(false);

  const specs = [
    { label: 'Make', value: car.make },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year.toString() },
    { label: 'Engine Type', value: car.engine_type },
    { label: 'Engine Size', value: car.engine_size || 'N/A' },
    { label: 'Horsepower', value: `${car.horsepower} HP` },
    { label: 'Torque', value: car.torque || 'N/A' },
    { label: 'Transmission', value: car.transmission_type || 'N/A' },
    { label: 'Drivetrain', value: car.drivetrain_type || 'N/A' },
    { label: 'Handling', value: car.handling === 'right' ? 'Right Hand Drive' : 'Left Hand Drive' },
    { label: 'Color', value: car.color || 'N/A' },
    { label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A' },
    { label: 'Location', value: car.location || 'Japan' },
    { label: 'Reference Number', value: car.reference_number },
  ];

  const displayedSpecs = expanded ? specs : specs.slice(0, 8);

  return (
    <Card variant="bordered" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-zen font-bold">Full Specifications</h2>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="ghost"
          size="sm"
        >
          {expanded ? 'Show Less' : 'Show All'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedSpecs.map((spec, idx) => (
          <div key={idx} className="border-b border-charcoal pb-3">
            <span className="text-sm text-text-secondary">{spec.label}:</span>
            <p className="text-text-primary font-medium">{spec.value}</p>
          </div>
        ))}
      </div>
      {car.specs && car.specs.length > 0 && (
        <div className="mt-6">
          <h3 className="font-zen text-lg mb-4">Additional Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {car.specs.map((spec, idx) => (
              <div key={idx} className="border-b border-charcoal pb-2">
                <span className="text-sm text-text-secondary">{spec.name}:</span>
                <p className="text-text-primary font-medium">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CarDetailPage;

