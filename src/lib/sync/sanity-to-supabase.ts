import { supabase } from '../supabase';
import { sanityClient } from '../sanity';
import groq from 'groq';
import { urlFor } from '../sanity';

/**
 * Maps Sanity car data to Supabase car format
 * Returns both the car data and specs array separately
 */
export function mapSanityCarToSupabase(sanityCar: any) {
  // Map status from Sanity to Supabase
  const statusMap: Record<string, string> = {
    available: 'available',
    reserved: 'reserved',
    sold: 'sold',
  };

  // Map specs to car_specs format
  const specs: any[] = [];
  if (sanityCar.specs) {
    const spec = sanityCar.specs;
    if (spec.engine) specs.push({ category: 'Engine', name: 'Engine', value: spec.engine });
    if (spec.displacement) specs.push({ category: 'Engine', name: 'Displacement', value: `${spec.displacement}L` });
    if (spec.induction) specs.push({ category: 'Engine', name: 'Induction', value: spec.induction.toUpperCase() });
    if (spec.power) specs.push({ category: 'Performance', name: 'Power', value: `${spec.power} HP` });
    if (spec.torque) specs.push({ category: 'Performance', name: 'Torque', value: `${spec.torque} Nm` });
    if (spec.zeroToHundred) specs.push({ category: 'Performance', name: '0-100 km/h', value: spec.zeroToHundred });
    if (spec.topSpeed) specs.push({ category: 'Performance', name: 'Top Speed', value: spec.topSpeed });
    if (spec.weight) specs.push({ category: 'Dimensions', name: 'Weight', value: `${spec.weight} kg` });
    if (spec.drivetrain) specs.push({ category: 'Drivetrain', name: 'Drivetrain', value: spec.drivetrain.toUpperCase() });
    if (spec.transmission) specs.push({ category: 'Transmission', name: 'Transmission', value: spec.transmission });
    if (spec.fuelType) specs.push({ category: 'Fuel', name: 'Fuel Type', value: spec.fuelType });
    if (spec.fuelConsumption) specs.push({ category: 'Fuel', name: 'Consumption', value: spec.fuelConsumption });
  }

  // Build features array
  const features: string[] = [];
  if (sanityCar.featured) features.push('Featured');
  if (sanityCar.hotImport) features.push('Hot Import');
  if (sanityCar.freshArrival) features.push('Fresh Arrival');
  if (sanityCar.rareUnit) features.push('Rare Unit');

  // Map maintenance records to description or notes
  const maintenanceNotes = sanityCar.maintenanceRecords?.length
    ? `\n\nMaintenance History:\n${sanityCar.maintenanceRecords
        .map((r: any) => `${new Date(r.date).toLocaleDateString()}: ${r.description}${r.cost ? ` ($${r.cost})` : ''}`)
        .join('\n')}`
    : '';

  return {
    // Basic car data
    sanity_id: sanityCar._id,
    reference_number: sanityCar.stockNumber || `SANITY-${sanityCar._id.slice(-8)}`,
    make: sanityCar.brand || '',
    model: sanityCar.model || '',
    year: sanityCar.year || new Date().getFullYear(),
    price: sanityCar.finalPrice || sanityCar.basePrice || 0,
    mileage: null, // Not in Sanity schema, can be added later
    engine_type: sanityCar.specs?.engine || null,
    engine_size: sanityCar.specs?.displacement ? `${sanityCar.specs.displacement}L` : null,
    transmission: sanityCar.specs?.transmission || null,
    drivetrain: sanityCar.specs?.drivetrain || null,
    horsepower: sanityCar.specs?.power || null,
    torque: sanityCar.specs?.torque ? `${sanityCar.specs.torque} Nm` : null,
    color: sanityCar.exteriorColor || null,
    location: sanityCar.location || null,
    status: statusMap[sanityCar.status] || 'available',
    description: `${sanityCar.description || ''}${maintenanceNotes}`.trim() || null,
    features: features.length > 0 ? features : null,
    sanity_synced_at: new Date().toISOString(),
    // Store specs and images separately for later processing
    _specs: specs,
    _images: sanityCar.images || [],
  };
}

/**
 * Syncs a single car from Sanity to Supabase
 */
export async function syncCarFromSanity(sanityId: string) {
  try {
    // Fetch car from Sanity
    const query = groq`*[_type == "car" && _id == $sanityId][0]{
      _id,
      title,
      slug,
      stockNumber,
      brand,
      model,
      year,
      vin,
      chassisCode,
      bodyType,
      exteriorColor,
      interiorColor,
      condition,
      status,
      importStatus,
      location,
      auctionGrade,
      previousOwners,
      registrationStatus,
      images[]{
        asset,
        alt,
        isPrimary
      },
      videoUrl,
      spin360Url,
      description,
      maintenanceRecords[]{
        date,
        description,
        cost
      },
      specs{
        engine,
        displacement,
        induction,
        power,
        torque,
        zeroToHundred,
        topSpeed,
        weight,
        drivetrain,
        transmission,
        fuelType,
        fuelConsumption
      },
      basePrice,
      importTax,
      shippingCost,
      finalPrice,
      negotiable,
      featured,
      hotImport,
      freshArrival,
      rareUnit,
      seoTitle,
      seoDescription,
      ogImage
    }`;

    const sanityCar = await sanityClient.fetch(query, { sanityId });

    if (!sanityCar) {
      throw new Error(`Car with Sanity ID ${sanityId} not found`);
    }

    // Map to Supabase format
    const mappedData = mapSanityCarToSupabase(sanityCar);
    const { _specs: specs, _images: images, ...carData } = mappedData;

    // Check if car already exists in Supabase
    const { data: existingCar } = await supabase
      .from('cars')
      .select('id')
      .eq('sanity_id', sanityId)
      .single();

    let carId: string;

    if (existingCar) {
      // Update existing car
      const { data, error } = await supabase
        .from('cars')
        .update(carData)
        .eq('sanity_id', sanityId)
        .select('id')
        .single();

      if (error) throw error;
      carId = data.id;

      // Delete existing images and specs
      await supabase.from('car_images').delete().eq('car_id', carId);
      await supabase.from('car_specs').delete().eq('car_id', carId);
    } else {
      // Insert new car
      const { data, error } = await supabase
        .from('cars')
        .insert(carData)
        .select('id')
        .single();

      if (error) throw error;
      carId = data.id;
    }

    // Sync images
    if (images && images.length > 0) {
      const imageInserts = images.map((img: any, index: number) => ({
        car_id: carId,
        url: img.asset ? urlFor(img.asset).url() : null,
        is_primary: img.isPrimary || index === 0,
      })).filter((img: any) => img.url); // Only insert images with valid URLs

      if (imageInserts.length > 0) {
        const { error: imagesError } = await supabase
          .from('car_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error syncing images:', imagesError);
        }
      }
    }

    // Sync specs
    if (specs && specs.length > 0) {
      const specInserts = specs.map((spec: any) => ({
        car_id: carId,
        category: spec.category,
        name: spec.name,
        value: spec.value,
      }));

      const { error: specsError } = await supabase
        .from('car_specs')
        .insert(specInserts);

      if (specsError) {
        console.error('Error syncing specs:', specsError);
      }
    }

    return { success: true, carId, sanityId };
  } catch (error) {
    console.error('Error syncing car from Sanity:', error);
    throw error;
  }
}

/**
 * Syncs all cars from Sanity to Supabase
 */
export async function syncAllCarsFromSanity() {
  try {
    const query = groq`*[_type == "car"]{
      _id
    }`;

    const cars = await sanityClient.fetch<{ _id: string }[]>(query);
    const results = [];

    for (const car of cars) {
      try {
        const result = await syncCarFromSanity(car._id);
        results.push({ ...result, success: true });
      } catch (error) {
        results.push({ sanityId: car._id, success: false, error: (error as Error).message });
      }
    }

    return results;
  } catch (error) {
    console.error('Error syncing all cars:', error);
    throw error;
  }
}

/**
 * Deletes a car from Supabase when deleted in Sanity
 */
export async function deleteCarFromSupabase(sanityId: string) {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('sanity_id', sanityId);

    if (error) throw error;
    return { success: true, sanityId };
  } catch (error) {
    console.error('Error deleting car from Supabase:', error);
    throw error;
  }
}

