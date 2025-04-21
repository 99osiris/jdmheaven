import React, { useState } from 'react';
import { Gallery } from '../components/cms/Gallery';
import { SEO } from '../components/SEO';

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  
  const categories = [
    { id: undefined, name: 'All' },
    { id: 'cars', name: 'Cars' },
    { id: 'events', name: 'Events' },
    { id: 'showroom', name: 'Showroom' },
    { id: 'imports', name: 'Imports' },
  ];

  return (
    <>
      <SEO
        title="Gallery | JDM HEAVEN"
        description="Browse our collection of premium Japanese performance cars and events"
      />
      
      <div className="pt-20">
        <div className="bg-midnight text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-zen mb-6">Gallery</h1>
            <p className="text-xl text-gray-300">Browse our collection of premium Japanese performance cars and events</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id || 'all'}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 ${
                  activeCategory === category.id
                    ? 'bg-racing-red text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition font-zen`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Gallery */}
          <Gallery category={activeCategory} columns={3} limit={24} />
        </div>
      </div>
    </>
  );
};

export default GalleryPage;