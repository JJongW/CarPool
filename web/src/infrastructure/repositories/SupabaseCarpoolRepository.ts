import { supabase } from "@/lib/SupabaseClient";

export class SupabaseCarpoolRepository {
  async getProfiles() {
    if (!supabase) return [];
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) throw error;
    return data ?? [];
  }

  async getVehicles() {
    if (!supabase) return [];
    const { data, error } = await supabase.from("vehicles").select("*");
    if (error) throw error;
    return data ?? [];
  }

  async getRideOffers(day: string) {
    if (!supabase) return [];
    const { data, error } = await supabase.from("ride_offers").select("*").eq("day", day);
    if (error) throw error;
    return data ?? [];
  }
}
