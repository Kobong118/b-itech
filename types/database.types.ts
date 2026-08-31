export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ctt_tabungan: {
        Row: {
          e_walet_app: string | null
          id: number
          id_name: number | null
          ket_e_walet: string | null
          keterangan: string | null
          nama: string | null
          no_rek: number | null
          setor_e_walet: number | null
          setor_tunai: number | null
          tanggal: string
          tarik_e_walet: number | null
          tarik_tunai: number | null
          update_at: string | null
          update_by: string | null
        }
        Insert: {
          e_walet_app?: string | null
          id?: number
          id_name?: number | null
          ket_e_walet?: string | null
          keterangan?: string | null
          nama?: string | null
          no_rek?: number | null
          setor_e_walet?: number | null
          setor_tunai?: number | null
          tanggal?: string
          tarik_e_walet?: number | null
          tarik_tunai?: number | null
          update_at?: string | null
          update_by?: string | null
        }
        Update: {
          e_walet_app?: string | null
          id?: number
          id_name?: number | null
          ket_e_walet?: string | null
          keterangan?: string | null
          nama?: string | null
          no_rek?: number | null
          setor_e_walet?: number | null
          setor_tunai?: number | null
          tanggal?: string
          tarik_e_walet?: number | null
          tarik_tunai?: number | null
          update_at?: string | null
          update_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctt_tabungan_id_name_fkey"
            columns: ["id_name"]
            isOneToOne: false
            referencedRelation: "data_jamaah"
            referencedColumns: ["id"]
          },
        ]
      }
      data_jamaah: {
        Row: {
          id: number
          jenis_kelamin: string | null
          kontak: number | null
          nama: string
          no_rek: number | null
          pin: number | null
          role: string | null
          total_tabungan: number | null
          update_at: string | null
          update_by: string | null
        }
        Insert: {
          id?: number
          jenis_kelamin?: string | null
          kontak?: number | null
          nama?: string
          no_rek?: number | null
          pin?: number | null
          role?: string | null
          total_tabungan?: number | null
          update_at?: string | null
          update_by?: string | null
        }
        Update: {
          id?: number
          jenis_kelamin?: string | null
          kontak?: number | null
          nama?: string
          no_rek?: number | null
          pin?: number | null
          role?: string | null
          total_tabungan?: number | null
          update_at?: string | null
          update_by?: string | null
        }
        Relationships: []
      }
      panitia: {
        Row: {
          id: number
          kata_sandi: string
          nama_pengguna: string
        }
        Insert: {
          id?: number
          kata_sandi?: string
          nama_pengguna?: string
        }
        Update: {
          id?: number
          kata_sandi?: string
          nama_pengguna?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
