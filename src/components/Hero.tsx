import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Car } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { VinDecoderQuick } from './VinDecoderQuick';

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    let isMounted = true;

    const loadYouTubeAPI = async () => {
      try {
        // Check if API is already loaded
        if (window.YT) {
          initializePlayer();
          return;
        }

        // Create script tag
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        
        // Create promise to wait for API to load
        const apiLoadPromise = new Promise((resolve, reject) => {
          window.onYouTubeIframeAPIReady = () => resolve(true);
          tag.onerror = () => reject(new Error('Failed to load YouTube API'));
          
          // Set timeout for loading
          setTimeout(() => reject(new Error('YouTube API load timeout')), 10000);
        });

        // Add script to page
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Wait for API to load
        await apiLoadPromise;
        if (isMounted) initializePlayer();
      } catch (error) {
        console.error('Error loading YouTube API:', error);
        if (isMounted) setVideoError(true);
      }
    };

    const initializePlayer = () => {
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
              if (isMounted) setVideoLoaded(true);
            },
            onError: () => {
              if (isMounted) setVideoError(true);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        if (isMounted) setVideoError(true);
      }
    };

    loadYouTubeAPI();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div id="home" className="relative h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* Fallback Image */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: 'url("/images/hero-fallback.jpg")',
          }}
        />
        
        {/* YouTube Video */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
        }`}>
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
            <div className="flex-1">
              <h1 className="font-zen text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-racing-red">
                JDM Heaven.<br />
                Imported. Tuned. Unleashed.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-3xl">
                From drift-ready beasts to collector's gems—your gateway to Japan's finest performance cars starts here.
              </p>

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
                  to="/inventory"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
                >
                  Browse JDM Inventory
                  <ChevronRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-midnight rounded-none hover:bg-gray-100 transition font-zen"
                >
                  Start Your Import
                </Link>
              </div>
            </div>

            <div className="hidden lg:block lg:w-80">
              <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <VinDecoderQuick />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;