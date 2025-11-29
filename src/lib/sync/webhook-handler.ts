/**
 * Webhook handler for Sanity webhooks
 * This can be called from Sanity webhooks or manually
 */

import { syncCarFromSanity, deleteCarFromSupabase } from './sanity-to-supabase';

export interface SanityWebhookPayload {
  _type: string;
  _id: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
  _deletedAt?: string;
}

/**
 * Handles Sanity webhook events
 */
export async function handleSanityWebhook(payload: SanityWebhookPayload) {
  try {
    // Only process car documents
    if (payload._type !== 'car') {
      return { success: true, message: 'Not a car document, skipping' };
    }

    // Handle deletion
    if (payload._deletedAt) {
      await deleteCarFromSupabase(payload._id);
      return { success: true, action: 'delete', sanityId: payload._id };
    }

    // Handle create/update
    const result = await syncCarFromSanity(payload._id);
    return { success: true, action: 'sync', ...result };
  } catch (error) {
    console.error('Error handling Sanity webhook:', error);
    throw error;
  }
}

/**
 * Manual sync trigger - can be called from admin panel
 */
export async function triggerSync(sanityId: string) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-sanity-car`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ sanityId, action: 'sync' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sync failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering sync:', error);
    throw error;
  }
}

