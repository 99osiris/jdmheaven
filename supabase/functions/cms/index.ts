import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { path } = new URL(req.url);
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No authorization token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user has admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user || user.user_metadata.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle different CMS operations based on path and method
    if (path.startsWith('/cms/cars')) {
      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('cars')
          .select(`
            *,
            images:car_images(id, url, is_primary),
            specs:car_specs(id, category, name, value)
          `);

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'POST') {
        const { car, images, specs } = await req.json();
        
        // Start a transaction
        const { data, error } = await supabase.rpc('create_car_with_details', {
          car_data: car,
          image_data: images,
          spec_data: specs
        });

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const { car, images, specs } = await req.json();
        
        // Update car details
        const { error: carError } = await supabase
          .from('cars')
          .update(car)
          .eq('id', car.id);

        if (carError) throw carError;

        // Update images
        if (images) {
          const { error: imageError } = await supabase
            .from('car_images')
            .upsert(images);

          if (imageError) throw imageError;
        }

        // Update specs
        if (specs) {
          const { error: specError } = await supabase
            .from('car_specs')
            .upsert(specs);

          if (specError) throw specError;
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'DELETE') {
        const { id } = await req.json();
        
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (path.startsWith('/cms/blog')) {
      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*');

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'POST') {
        const post = await req.json();
        
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(post)
          .select()
          .single();

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const post = await req.json();
        
        const { data, error } = await supabase
          .from('blog_posts')
          .update(post)
          .eq('id', post.id)
          .select()
          .single();

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'DELETE') {
        const { id } = await req.json();
        
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});