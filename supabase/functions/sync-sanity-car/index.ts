import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { createClient as createSanityClient } from 'npm:@sanity/client@6.10.0';
import { createImageUrlBuilder } from 'npm:@sanity/image-url@1.0.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Sanity client
const sanityClient = createSanityClient({
  projectId: Deno.env.get('SANITY_PROJECT_ID') || '',
  dataset: Deno.env.get('SANITY_DATASET') || 'car-inventory', // Match main app dataset
  useCdn: false,
  apiVersion: '2023-05-03', // Match main app API version
  token: Deno.env.get('SANITY_API_TOKEN') || '',
});

const builder = createImageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source);

// Map Sanity car to Supabase format
function mapSanityCarToSupabase(sanityCar: any) {
  const statusMap: Record<string, string> = {
    available: 'available',
    reserved: 'reserved',
    sold: 'sold',
  };

  const primaryImage = sanityCar.images?.find((img: any) => img.isPrimary) || sanityCar.images?.[0];
  const primaryImageUrl = primaryImage?.asset ? urlFor(primaryImage.asset).url() : null;

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

  const features: string[] = [];
  if (sanityCar.featured) features.push('Featured');
  if (sanityCar.hotImport) features.push('Hot Import');
  if (sanityCar.freshArrival) features.push('Fresh Arrival');
  if (sanityCar.rareUnit) features.push('Rare Unit');

  const maintenanceNotes = sanityCar.maintenanceRecords?.length
    ? `\n\nMaintenance History:\n${sanityCar.maintenanceRecords
        .map((r: any) => `${new Date(r.date).toLocaleDateString()}: ${r.description}${r.cost ? ` ($${r.cost})` : ''}`)
        .join('\n')}`
    : '';

    const now = new Date().toISOString();
    return {
      sanity_id: sanityCar._id,
      reference_number: sanityCar.stockNumber || `SANITY-${sanityCar._id.slice(-8)}`,
      make: sanityCar.brand || '',
      model: sanityCar.model || '',
      year: sanityCar.year || new Date().getFullYear(),
      price: sanityCar.finalPrice || sanityCar.basePrice || 0,
      mileage: null,
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
      sanity_synced_at: now,
      created_at: sanityCar.createdAt || now, // Use Sanity createdAt or current time
      updated_at: sanityCar.updatedAt || now, // Use Sanity updatedAt or current time
      specs, // Store for later use
      images: sanityCar.images || [],
    };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();

    // Handle both Sanity webhook format and manual sync format
    let sanityId: string;
    let action: string = 'sync';

    // Sanity webhook can send data in different formats
    // Format 1: Direct document data with _id
    if (body._id) {
      sanityId = body._id;
      // Check if it's a deletion (Sanity sends _deletedAt for deletions)
      if (body._deletedAt || body._type === 'deleted') {
        action = 'delete';
      }
    }
    // Format 2: Webhook payload with projectId and documents array
    else if (body.projectId && body.documents && body.documents.length > 0) {
      // Sanity webhook sends documents array
      const doc = body.documents[0];
      sanityId = doc._id;
      if (doc._deletedAt) {
        action = 'delete';
      }
    }
    // Format 3: Manual sync format
    else if (body.sanityId) {
      sanityId = body.sanityId;
      action = body.action || 'sync';
    }
    // Format 4: Sanity webhook with projectId and ids array
    else if (body.projectId && body.ids && body.ids.length > 0) {
      sanityId = body.ids[0];
      // Check mutation type
      if (body.mutations && body.mutations.length > 0) {
        const mutation = body.mutations[0];
        if (mutation.delete || mutation.create?.delete) {
          action = 'delete';
        }
      }
    }
    else {
      return new Response(
        JSON.stringify({ 
          error: 'sanityId or _id is required',
          received: Object.keys(body),
          body: JSON.stringify(body).substring(0, 500)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete') {
      // Delete car from Supabase
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('sanity_id', sanityId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, action: 'delete', sanityId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch car from Sanity
    const query = `*[_type == "car" && _id == $sanityId][0]{
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
      rareUnit
    }`;

    const sanityCar = await sanityClient.fetch(query, { sanityId });

    if (!sanityCar) {
      return new Response(
        JSON.stringify({ error: `Car with Sanity ID ${sanityId} not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map to Supabase format
    const mappedData = mapSanityCarToSupabase(sanityCar);
    const { specs, images, ...carData } = mappedData;

    // Check if car exists
    const { data: existingCar } = await supabase
      .from('cars')
      .select('id')
      .eq('sanity_id', sanityId)
      .single();

    let carId: string;

    if (existingCar) {
      // Update existing - preserve created_at, update updated_at
      const { created_at, ...updateData } = carData;
      const { data, error } = await supabase
        .from('cars')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('sanity_id', sanityId)
        .select('id')
        .single();

      if (error) throw error;
      carId = data.id;

      // Delete existing images and specs
      await supabase.from('car_images').delete().eq('car_id', carId);
      await supabase.from('car_specs').delete().eq('car_id', carId);
    } else {
      // Insert new
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
      })).filter((img: any) => img.url);

      if (imageInserts.length > 0) {
        await supabase.from('car_images').insert(imageInserts);
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

      await supabase.from('car_specs').insert(specInserts);
    }

    return new Response(
      JSON.stringify({ success: true, carId, sanityId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing car:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

