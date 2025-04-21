import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface VinDecoderResult {
  make: string;
  model: string;
  year: number;
  engine: string;
  transmission: string;
  bodyType: string;
  driveType: string;
  manufacturer: string;
  plantCountry: string;
  series: string;
}

export interface VehicleHistory {
  id: string;
  vin: string;
  event: string;
  location: string;
  timestamp: string;
  details: string;
  status: 'in_transit' | 'customs' | 'delivered' | 'processing';
}

export const vinApi = {
  async decode(vin: string): Promise<VinDecoderResult> {
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to decode VIN');
      }

      const results = data.Results.reduce((acc: any, item: any) => {
        if (item.Value && item.Value !== 'null') {
          acc[item.Variable.toLowerCase().replace(/\s+/g, '')] = item.Value;
        }
        return acc;
      }, {});

      return {
        make: results.make || 'Unknown',
        model: results.model || 'Unknown',
        year: parseInt(results.modelyear) || 0,
        engine: results.enginemodel || results.enginconfiguration || 'Unknown',
        transmission: results.transmissionstyle || 'Unknown',
        bodyType: results.bodyclass || 'Unknown',
        driveType: results.drivetype || 'Unknown',
        manufacturer: results.manufacturer || 'Unknown',
        plantCountry: results.plantcountry || 'Unknown',
        series: results.series || 'Unknown',
      };
    } catch (error) {
      console.error('Error decoding VIN:', error);
      throw error;
    }
  },

  async saveSearch(vin: string, result: VinDecoderResult) {
    try {
      const { error } = await supabase
        .from('vin_searches')
        .insert([{ vin, result }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving VIN search:', error);
    }
  },

  async getVehicleHistory(vin: string): Promise<VehicleHistory[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_history')
        .select('*')
        .eq('vin', vin)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vehicle history:', error);
      throw error;
    }
  },

  async addHistoryEvent(
    vin: string,
    event: string,
    location: string,
    status: VehicleHistory['status'],
    details: string
  ) {
    try {
      const { error } = await supabase
        .from('vehicle_history')
        .insert([{
          vin,
          event,
          location,
          status,
          details,
          timestamp: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding history event:', error);
      throw error;
    }
  },

  async getVehicleStatus(vin: string): Promise<VehicleHistory['status'] | null> {
    try {
      const { data, error } = await supabase
        .from('vehicle_history')
        .select('status')
        .eq('vin', vin)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data?.status || null;
    } catch (error) {
      console.error('Error fetching vehicle status:', error);
      return null;
    }
  }
};