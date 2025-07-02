export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      directory_listings: {
        Row: {
          address: string | null;
          created_at: string;
          description: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          name: string;
          phone: string | null;
          type: Database["public"]["Enums"]["listing_type"];
          user_id: string;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name: string;
          phone?: string | null;
          type: Database["public"]["Enums"]["listing_type"];
          user_id: string;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          phone?: string | null;
          type?: Database["public"]["Enums"]["listing_type"];
          user_id?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      folierer: {
        Row: {
          adresse: string | null;
          ansprechpartner: string | null;
          created_at: string;
          firma: string | null;
          logo_url: string | null;
          plz_ort: string | null;
          spezialisierungen: string | null;
          strasse_hausnummer: string | null;
          telefon: string | null;
          updated_at: string | null;
          user_id: string;
          webseite: string | null;
          youtube_channel_url: string | null;
        };
        Insert: {
          adresse?: string | null;
          ansprechpartner?: string | null;
          created_at?: string;
          firma?: string | null;
          logo_url?: string | null;
          plz_ort?: string | null;
          spezialisierungen?: string | null;
          strasse_hausnummer?: string | null;
          telefon?: string | null;
          updated_at?: string | null;
          user_id: string;
          webseite?: string | null;
          youtube_channel_url?: string | null;
        };
        Update: {
          adresse?: string | null;
          ansprechpartner?: string | null;
          created_at?: string;
          firma?: string | null;
          logo_url?: string | null;
          plz_ort?: string | null;
          spezialisierungen?: string | null;
          strasse_hausnummer?: string | null;
          telefon?: string | null;
          updated_at?: string | null;
          user_id?: string;
          webseite?: string | null;
          youtube_channel_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "folierer_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      haendler: {
        Row: {
          adresse: string | null;
          ansprechpartner: string | null;
          created_at: string;
          firma: string | null;
          logo_url: string | null;
          plz_ort: string | null;
          strasse_hausnummer: string | null;
          telefon: string | null;
          updated_at: string | null;
          user_id: string;
          webseite: string | null;
        };
        Insert: {
          adresse?: string | null;
          ansprechpartner?: string | null;
          created_at?: string;
          firma?: string | null;
          logo_url?: string | null;
          plz_ort?: string | null;
          strasse_hausnummer?: string | null;
          telefon?: string | null;
          updated_at?: string | null;
          user_id: string;
          webseite?: string | null;
        };
        Update: {
          adresse?: string | null;
          ansprechpartner?: string | null;
          created_at?: string;
          firma?: string | null;
          logo_url?: string | null;
          plz_ort?: string | null;
          strasse_hausnummer?: string | null;
          telefon?: string | null;
          updated_at?: string | null;
          user_id?: string;
          webseite?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "haendler_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      hersteller: {
        Row: {
          adresse: string | null;
          ansprechpartner: string | null;
          created_at: string;
          firma: string | null;
          logo_url: string | null;
          plz_ort: string | null;
          strasse_hausnummer: string | null;
          telefon: string | null;
          updated_at: string | null;
          user_id: string;
          webseite: string | null;
        };
        Insert: {
          adresse?: string | null;
          ansprechpartner?: string | null;
          created_at?: string;
          firma?: string | null;
          logo_url?: string | null;
          plz_ort?: string | null;
          strasse_hausnummer?: string | null;
          telefon?: string | null;
          updated_at?: string | null;
          user_id: string;
          webseite?: string | null;
        };
        Update: {
          adresse?: string | null;
          ansprechpartner?: string | null;
          created_at?: string;
          firma?: string | null;
          logo_url?: string | null;
          plz_ort?: string | null;
          strasse_hausnummer?: string | null;
          telefon?: string | null;
          updated_at?: string | null;
          user_id?: string;
          webseite?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hersteller_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      portfolio_images: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string;
          storage_path: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url: string;
          storage_path: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string;
          storage_path?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_images_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          role: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      team_members: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          phone: string | null;
          position: string;
          user_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          phone?: string | null;
          position: string;
          user_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string | null;
          position?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_user_profile_and_role: {
        Args: {
          user_id: string;
          role: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      listing_type: "folierer" | "vertrieb" | "hersteller";
      user_role: "admin" | "vertrieb" | "hersteller";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof Database["public"]["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
