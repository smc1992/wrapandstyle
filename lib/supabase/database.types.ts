export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      certificates: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          issue_date: string | null
          issuer: string
          storage_path: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer: string
          storage_path?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer?: string
          storage_path?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      directory_listings: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          type: Database["public"]["Enums"]["listing_type"]
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          type: Database["public"]["Enums"]["listing_type"]
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["listing_type"]
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      folierer: {
        Row: {
          address: string | null
          adresse: string | null
          ansprechpartner: string | null
          company_description: string | null
          company_history: string | null
          created_at: string
          firma: string | null
          logo_url: string | null
          mission_statement: string | null
          opening_hours: Json | null
          phone_number: string | null
          plz_ort: string | null
          services: string[] | null
          slug: string | null
          spezialisierungen: string | null
          strasse_hausnummer: string | null
          telefon: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
          vision_statement: string | null
          webseite: string | null
          youtube_channel_url: string | null
        }
        Insert: {
          address?: string | null
          adresse?: string | null
          ansprechpartner?: string | null
          company_description?: string | null
          company_history?: string | null
          created_at?: string
          firma?: string | null
          logo_url?: string | null
          mission_statement?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          plz_ort?: string | null
          services?: string[] | null
          slug?: string | null
          spezialisierungen?: string | null
          strasse_hausnummer?: string | null
          telefon?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          vision_statement?: string | null
          webseite?: string | null
          youtube_channel_url?: string | null
        }
        Update: {
          address?: string | null
          adresse?: string | null
          ansprechpartner?: string | null
          company_description?: string | null
          company_history?: string | null
          created_at?: string
          firma?: string | null
          logo_url?: string | null
          mission_statement?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          plz_ort?: string | null
          services?: string[] | null
          slug?: string | null
          spezialisierungen?: string | null
          strasse_hausnummer?: string | null
          telefon?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          vision_statement?: string | null
          webseite?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: []
      }
      folierer_services: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      haendler: {
        Row: {
          address: string | null
          ansprechpartner: string | null
          brands: string[] | null
          company_description: string | null
          created_at: string
          firma: string | null
          logo_url: string | null
          opening_hours: Json | null
          phone_number: string | null
          product_categories: string[] | null
          telefon: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
          webseite: string | null
          youtube_channel_url: string | null
        }
        Insert: {
          address?: string | null
          ansprechpartner?: string | null
          brands?: string[] | null
          company_description?: string | null
          created_at?: string
          firma?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          product_categories?: string[] | null
          telefon?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          webseite?: string | null
          youtube_channel_url?: string | null
        }
        Update: {
          address?: string | null
          ansprechpartner?: string | null
          brands?: string[] | null
          company_description?: string | null
          created_at?: string
          firma?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          product_categories?: string[] | null
          telefon?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          webseite?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: []
      }
      hersteller: {
        Row: {
          address: string | null
          ansprechpartner: string | null
          company_description: string | null
          created_at: string
          firma: string | null
          logo_url: string | null
          opening_hours: Json | null
          phone_number: string | null
          product_categories: string[] | null
          telefon: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
          webseite: string | null
          youtube_channel_url: string | null
        }
        Insert: {
          address?: string | null
          ansprechpartner?: string | null
          company_description?: string | null
          created_at?: string
          firma?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          product_categories?: string[] | null
          telefon?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          webseite?: string | null
          youtube_channel_url?: string | null
        }
        Update: {
          address?: string | null
          ansprechpartner?: string | null
          company_description?: string | null
          created_at?: string
          firma?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          product_categories?: string[] | null
          telefon?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          webseite?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          storage_path: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          storage_path: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          storage_path?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "folierer"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          created_at: string | null
          description: string | null
          folierer_id: string | null
          id: string
          title: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          folierer_id?: string | null
          id?: string
          title?: string | null
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          folierer_id?: string | null
          id?: string
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_folierer_id_fkey"
            columns: ["folierer_id"]
            isOneToOne: false
            referencedRelation: "folierer"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          slug: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_company: string | null
          author_name: string
          created_at: string
          id: string
          testimonial_text: string
          user_id: string
        }
        Insert: {
          author_company?: string | null
          author_name: string
          created_at?: string
          id?: string
          testimonial_text: string
          user_id: string
        }
        Update: {
          author_company?: string | null
          author_name?: string
          created_at?: string
          id?: string
          testimonial_text?: string
          user_id?: string
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
      listing_type: "folierer" | "vertrieb" | "hersteller"
      user_role: "admin" | "vertrieb" | "hersteller"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      listing_type: ["folierer", "vertrieb", "hersteller"],
      user_role: ["admin", "vertrieb", "hersteller"],
    },
  },
} as const
