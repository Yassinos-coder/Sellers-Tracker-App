import { supabaseClient } from "../config/supabaseConfig";
// primary setup will update things later
export class supabaseRepository {
  public updateColumn = async (PAYLOAD: any) => {
    try {
      const { data, error } = await supabaseClient
        .schema("kpis")
        .from(PAYLOAD.table_name)
        .update('')
        .eq("client_id", PAYLOAD.client_id);
    } catch (error) {}
  };
}
