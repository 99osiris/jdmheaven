import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface ShippingRate {
  service: string;
  price: number;
  duration: string;
  provider: string;
  transitTime: string;
  restrictions?: string[];
}

export interface ShippingCalculation {
  cbm: number;
  weight: number;
  rates: ShippingRate[];
  warnings?: string[];
}

export interface ShippingDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export const shippingApi = {
  async calculateRates(
    dimensions: ShippingDimensions,
    origin: string,
    destination: string
  ): Promise<ShippingCalculation> {
    try {
      // Calculate CBM (Cubic Meters)
      const cbm = (dimensions.length * dimensions.width * dimensions.height) / 1000000;
      
      // Calculate volumetric weight (industry standard)
      const volumetricWeight = cbm * 167; // Standard conversion factor
      
      // Use the greater of actual weight or volumetric weight
      const chargeableWeight = Math.max(dimensions.weight, volumetricWeight);

      // Base rate calculation (€/kg or €/cbm, whichever is higher)
      const baseRate = Math.max(cbm * 1000, dimensions.weight * 10);

      // Calculate different shipping options
      const rates: ShippingRate[] = [
        {
          service: 'Standard Container Shipping',
          price: baseRate,
          duration: '30-45 days',
          provider: 'Ocean Freight',
          transitTime: '25-35 days',
          restrictions: [
            'Requires full documentation',
            'Subject to container availability'
          ]
        },
        {
          service: 'Express Container Shipping',
          price: baseRate * 1.5,
          duration: '20-30 days',
          provider: 'Premium Ocean Freight',
          transitTime: '15-25 days',
          restrictions: [
            'Priority loading',
            'Guaranteed container space'
          ]
        },
        {
          service: 'Premium RoRo Shipping',
          price: baseRate * 2,
          duration: '15-20 days',
          provider: 'RoRo Service',
          transitTime: '12-15 days',
          restrictions: [
            'Vehicle must be in running condition',
            'Limited to specific ports'
          ]
        }
      ];

      // Add warnings for oversized vehicles
      const warnings: string[] = [];
      if (cbm > 20) {
        warnings.push('Vehicle size exceeds standard container dimensions');
      }
      if (dimensions.weight > 2500) {
        warnings.push('Vehicle weight requires special handling');
      }

      // Save calculation to database for tracking
      await supabase
        .from('shipping_calculations')
        .insert({
          dimensions,
          origin,
          destination,
          cbm,
          chargeable_weight: chargeableWeight,
          calculated_rates: rates
        });

      return {
        cbm,
        weight: chargeableWeight,
        rates,
        warnings
      };
    } catch (error) {
      console.error('Error calculating shipping rates:', error);
      throw error;
    }
  },

  getDestinations(): { code: string; name: string; restrictions?: string[] }[] {
    return [
      { 
        code: 'NL',
        name: 'Netherlands',
        restrictions: ['Requires EU compliance certification']
      },
      { 
        code: 'DE',
        name: 'Germany',
        restrictions: ['TÜV certification required']
      },
      { 
        code: 'BE',
        name: 'Belgium',
        restrictions: ['EU compliance certification required']
      },
      { 
        code: 'FR',
        name: 'France',
        restrictions: ['Requires French import license']
      },
      { 
        code: 'GB',
        name: 'United Kingdom',
        restrictions: ['Right-hand drive vehicles preferred']
      },
      { 
        code: 'IT',
        name: 'Italy',
        restrictions: ['Special permits for modified vehicles']
      },
      { 
        code: 'ES',
        name: 'Spain',
        restrictions: ['Emissions compliance documentation required']
      },
      { 
        code: 'AT',
        name: 'Austria',
        restrictions: ['Noise level certification required']
      },
      { 
        code: 'CH',
        name: 'Switzerland',
        restrictions: ['Special import permits required']
      }
    ];
  }
};