import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Car } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { VinDecoderQuick } from '../VinDecoderQuick';
import { cms } from '../../lib/cms';
import { motion } from 'framer-motion';
import { withRetry } from '../../lib/sanity-client';

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
}

export const HeroFromCMS: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use a try-catch block to handle errors
        try {
          const data = await cms.getHero();
          setHeroContent(data);
        } catch (err: any) {
          console.error('Failed to load hero content:', err);
          setError(err.error || 'Failed to load content');
        }
      } finally {
        setLoading(false);
      }
    };

    loadHeroContent();

    // Create YouTube Player
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      try {
        new window.YT.Player('hero-video', {
          videoId: '31kplxJn6nw',
          playerVars: {
            autoplay: 1,
            loop: 1,
            controls: 0,
            showinfo: 0,
            mute: 1,
            rel: 0,
            playsinline: 1,
            playlist: '31kplxJn6nw'
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
              setVideoLoaded(true);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        // Continue without video
        setVideoLoaded(false);
      }
    };
  }, [retryCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  // Default content to use if CMS fails or is loading
  const defaultTitle = "JDM Heaven.<br/>Imported. Tuned. Unleashed.";
  const defaultSubtitle = "From drift-ready beasts to collector's gems—your gateway to Japan's finest performance cars starts here.";
  const defaultCtaPrimary = "Browse JDM Inventory";
  const defaultCtaSecondary = "Start Your Import";
  const defaultCtaPrimaryLink = "/inventory";
  const defaultCtaSecondaryLink = "/contact";

  return (
    <div id="home" className="relative h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* Fallback Image */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: heroContent?.backgroundImage 
              ? `url(${heroContent.backgroundImage})`
              : 'url("https://performancegarage.com.au/images/blog/6/JDM_Revival.png")',
          }}
        />
        
        {/* YouTube Video */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-full h-full">
            <div id="hero-video" className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {error ? (
                <div className="bg-black/30 p-8 rounded-lg mb-8">
                  <p className="text-white mb-4">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="bg-racing-red text-white px-6 py-3 hover:bg-red-700 transition font-zen"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <h1 
                    className="font-zen text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-racing-red"
                    dangerouslySetInnerHTML={{ 
                      __html: loading || error ? defaultTitle : (heroContent?.title || defaultTitle)
                    }}
                  />
                  <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-3xl">
                    {loading || error ? defaultSubtitle : (heroContent?.subtitle || defaultSubtitle)}
                  </p>
                </>
              )}

              <form onSubmit={handleSearch} className="max-w-3xl mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search your dream car (e.g., Skyline GT-R, Supra, RX-7)..."
                      className="w-full py-3 sm:py-4 px-6 pl-12 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red transition"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3 sm:top-4 text-gray-300" />
                  </div>
                  <button
                    type="submit"
                    className="bg-racing-red text-white px-6 py-3 sm:px-8 sm:py-4 rounded-none hover:bg-red-700 transition font-zen flex items-center justify-center"
                  >
                    <Car className="mr-2" size={20} />
                    Search Cars
                  </button>
                </div>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link
                  to={loading || error ? defaultCtaPrimaryLink : (heroContent?.ctaPrimaryLink || defaultCtaPrimaryLink)}
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
                >
                  {loading || error ? defaultCtaPrimary : (heroContent?.ctaPrimary || defaultCtaPrimary)}
                  <ChevronRight className="ml-2" size={20} />
                </Link>
                <Link
                  to={loading || error ? defaultCtaSecondaryLink : (heroContent?.ctaSecondaryLink || defaultCtaSecondaryLink)}
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-midnight rounded-none hover:bg-gray-100 transition font-zen"
                >
                  {loading || error ? defaultCtaSecondary : (heroContent?.ctaSecondary || defaultCtaSecondary)}
                </Link>
              </div>
            </motion.div>

            <div className="hidden lg:block lg:w-80">
              <motion.div
                initial={{ opacity: 0, rotate: -5 }}
                animate={{ opacity: 1, rotate: -2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="transform hover:rotate-0 transition-transform duration-300"
              >
                <VinDecoderQuick />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFromCMS;