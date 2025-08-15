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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          description: string | null
          id: number
          image_url: string | null
          name: string
          unlocks_content: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          unlocks_content?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          unlocks_content?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          username: string | null
          xp_points: number | null
        }
        Insert: {
          created_at?: string | null
          id: string
          username?: string | null
          xp_points?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          username?: string | null
          xp_points?: number | null
        }
        Relationships: []
      }
      scenario_words: {
        Row: {
          frequency_in_scenario: string | null
          id: number
          learning_priority: number
          scenario_id: number
          word_id: string
        }
        Insert: {
          frequency_in_scenario?: string | null
          id?: number
          learning_priority: number
          scenario_id: number
          word_id: string
        }
        Update: {
          frequency_in_scenario?: string | null
          id?: number
          learning_priority?: number
          scenario_id?: number
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_words_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scenario_words_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          audio_ambience_url: string | null
          created_at: string | null
          cultural_briefing: string | null
          description: string | null
          id: number
          location_context: string | null
          title: string
          unlock_message: string | null
        }
        Insert: {
          audio_ambience_url?: string | null
          created_at?: string | null
          cultural_briefing?: string | null
          description?: string | null
          id?: number
          location_context?: string | null
          title: string
          unlock_message?: string | null
        }
        Update: {
          audio_ambience_url?: string | null
          created_at?: string | null
          cultural_briefing?: string | null
          description?: string | null
          id?: number
          location_context?: string | null
          title?: string
          unlock_message?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          achieved_at: string | null
          badge_id: number
          id: number
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          badge_id: number
          id?: number
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          badge_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scenario_progress: {
        Row: {
          highest_score: number | null
          id: number
          mastered_at: string | null
          scenario_id: number
          status: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          highest_score?: number | null
          id?: number
          mastered_at?: string | null
          scenario_id: number
          status?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          highest_score?: number | null
          id?: number
          mastered_at?: string | null
          scenario_id?: number
          status?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scenario_progress_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scenario_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_word_progress: {
        Row: {
          id: number
          last_reviewed_at: string | null
          mastery_level: number
          next_review_at: string | null
          pronunciation_score: number | null
          times_correct: number | null
          times_incorrect: number | null
          user_id: string
          word_id: string
        }
        Insert: {
          id?: number
          last_reviewed_at?: string | null
          mastery_level?: number
          next_review_at?: string | null
          pronunciation_score?: number | null
          times_correct?: number | null
          times_incorrect?: number | null
          user_id: string
          word_id: string
        }
        Update: {
          id?: number
          last_reviewed_at?: string | null
          mastery_level?: number
          next_review_at?: string | null
          pronunciation_score?: number | null
          times_correct?: number | null
          times_incorrect?: number | null
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_word_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          audio_url: string | null
          created_at: string | null
          cultural_context: string | null
          english_translation: string
          id: string
          image_mnemonic_url: string | null
          kannada_script: string
          memory_association: string | null
          roman_pronunciation: string
          similar_hindi: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          cultural_context?: string | null
          english_translation: string
          id: string
          image_mnemonic_url?: string | null
          kannada_script: string
          memory_association?: string | null
          roman_pronunciation: string
          similar_hindi?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          cultural_context?: string | null
          english_translation?: string
          id?: string
          image_mnemonic_url?: string | null
          kannada_script?: string
          memory_association?: string | null
          roman_pronunciation?: string
          similar_hindi?: string | null
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
