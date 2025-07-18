import { supabaseClient } from "../config/supabaseConfig";

export class supabaseRepository {
  public updateColumn = async (PAYLOAD: {
    table_name: string;
    client_id: string;
    new_entry_key: string;
    new_entry_value: any;
  }) => {
    try {
      // Step 1: Fetch existing seller_history darori to update supabase column kif bghina
      const { data: existingData, error: fetchError } = await supabaseClient
        .schema("kpis")
        .from("tutorax_sales")
        .select("affected_cm_history")
        .eq("client_id", PAYLOAD.client_id)
        .single();

      if (fetchError) throw "❌ Error fetching";

      // Step 2: Merge new entry
      const updatedHistory = {
        ...(existingData?.affected_cm_history || {}),
        [PAYLOAD.new_entry_key]: PAYLOAD.new_entry_value,
      };

      // Step 3: Update affected_cm_history column
      const { data, error: updateError } = await supabaseClient
        .schema("kpis")
        .from("tutorax_sales")
        .update({ affected_cm_history: updatedHistory })
        .eq("client_id", PAYLOAD.client_id);

      if (updateError) throw "❌ Error updating";

      return data;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };
  public checkSeller = async (actorID: number): Promise<string | boolean> => {
    try {
      const { data, error } = await supabaseClient
        .schema("tutorax")
        .from("client_managers")
        .select("*")
        .eq("client_manager_id", actorID);

      if (error) {
        throw new Error(`Error checking seller: ${error.message}`);
      }

      if (!data?.length) {
        return false;
      }

      return true; // Actor is a seller
    } catch (error) {
      console.error("Error checking seller:", error);
      throw error;
    }
  };
}
