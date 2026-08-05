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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      board_labels: {
        Row: {
          board_id: string
          color: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          board_id: string
          color: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_labels_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_lists: {
        Row: {
          board_id: string
          color: string | null
          created_at: string | null
          id: string
          position: number
          title: string
          updated_at: string | null
        }
        Insert: {
          board_id: string
          color?: string | null
          created_at?: string | null
          id?: string
          position: number
          title: string
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          color?: string | null
          created_at?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_lists_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_members: {
        Row: {
          board_id: string
          created_at: string | null
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          board_id: string
          created_at?: string | null
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          board_id?: string
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_members_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          owner_id: string
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["board_visibility"] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id: string
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["board_visibility"] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id?: string
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["board_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "boards_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_activities: {
        Row: {
          board_id: string
          card_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          board_id: string
          card_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          board_id?: string
          card_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_activities_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_activities_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_attachments: {
        Row: {
          board_id: string
          card_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          path: string
          size: number
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          board_id: string
          card_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          path: string
          size: number
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          board_id?: string
          card_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          path?: string
          size?: number
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_attachments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_comments: {
        Row: {
          card_id: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_custom_values: {
        Row: {
          card_id: string
          created_at: string | null
          custom_field_id: string
          id: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          custom_field_id: string
          id?: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          custom_field_id?: string
          id?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "card_custom_values_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_custom_values_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      card_labels: {
        Row: {
          board_label_id: string | null
          card_id: string
          color: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          board_label_id?: string | null
          card_id: string
          color: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          board_label_id?: string | null
          card_id?: string
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_labels_board_label_id_fkey"
            columns: ["board_label_id"]
            isOneToOne: false
            referencedRelation: "board_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_labels_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_members: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_members_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          completed: boolean | null
          cover_color: string | null
          cover_images: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          list_id: string
          position: number
          priority: Database["public"]["Enums"]["card_priority"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          cover_color?: string | null
          cover_images?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          list_id: string
          position: number
          priority?: Database["public"]["Enums"]["card_priority"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          cover_color?: string | null
          cover_images?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          list_id?: string
          position?: number
          priority?: Database["public"]["Enums"]["card_priority"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "board_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          board_id: string
          created_at: string | null
          field_type: string
          id: string
          name: string
          options: Json | null
          position: number
          required: boolean | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          field_type: string
          id?: string
          name: string
          options?: Json | null
          position: number
          required?: boolean | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          field_type?: string
          id?: string
          name?: string
          options?: Json | null
          position?: number
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      datas_bloqueadas: {
        Row: {
          created_at: string
          data: string
          id: string
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
        }
        Relationships: []
      }
      equipment_loans: {
        Row: {
          created_at: string | null
          equipment_id: string
          id: string
          loaned_at: string | null
          loaned_by: string | null
          notes: string | null
          returned_at: string | null
          returned_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_id: string
          id?: string
          loaned_at?: string | null
          loaned_by?: string | null
          notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          loaned_at?: string | null
          loaned_by?: string | null
          notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_loans_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_loans_loaned_by_fkey"
            columns: ["loaned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_loans_returned_by_fkey"
            columns: ["returned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_loans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipments: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          model: string
          name: string
          serial_number: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          model: string
          name: string
          serial_number: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          model?: string
          name?: string
          serial_number?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          response: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          response?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          response?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          all_day: boolean | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string
          id: string
          location: string | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ig_account_insights: {
        Row: {
          accounts_engaged: number | null
          collected_at: string
          id: string
          impressions: number | null
          lost_followers: number | null
          new_followers: number | null
          profile_visits: number | null
          raw: Json | null
          reach: number | null
          snapshot_date: string
          total_interactions: number | null
          username: string
          website_clicks: number | null
        }
        Insert: {
          accounts_engaged?: number | null
          collected_at?: string
          id?: string
          impressions?: number | null
          lost_followers?: number | null
          new_followers?: number | null
          profile_visits?: number | null
          raw?: Json | null
          reach?: number | null
          snapshot_date?: string
          total_interactions?: number | null
          username: string
          website_clicks?: number | null
        }
        Update: {
          accounts_engaged?: number | null
          collected_at?: string
          id?: string
          impressions?: number | null
          lost_followers?: number | null
          new_followers?: number | null
          profile_visits?: number | null
          raw?: Json | null
          reach?: number | null
          snapshot_date?: string
          total_interactions?: number | null
          username?: string
          website_clicks?: number | null
        }
        Relationships: []
      }
      ig_accounts: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          id: string
          last_collected_at: string | null
          last_error: string | null
          password: string
          status: string
          updated_at: string
          username: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          last_collected_at?: string | null
          last_error?: string | null
          password: string
          status?: string
          updated_at?: string
          username: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          last_collected_at?: string | null
          last_error?: string | null
          password?: string
          status?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      ig_audience: {
        Row: {
          collected_at: string
          dimension: string
          id: string
          key: string
          snapshot_date: string
          username: string
          value: number
        }
        Insert: {
          collected_at?: string
          dimension: string
          id?: string
          key: string
          snapshot_date?: string
          username: string
          value: number
        }
        Update: {
          collected_at?: string
          dimension?: string
          id?: string
          key?: string
          snapshot_date?: string
          username?: string
          value?: number
        }
        Relationships: []
      }
      ig_comments: {
        Row: {
          analyzed_at: string | null
          collected_at: string
          comment_id: string
          comment_username: string | null
          demand_category: string | null
          id: string
          is_demand: boolean | null
          like_count: number | null
          media_pk: string
          sentiment: string | null
          text: string | null
          timestamp: string | null
          username: string
        }
        Insert: {
          analyzed_at?: string | null
          collected_at?: string
          comment_id: string
          comment_username?: string | null
          demand_category?: string | null
          id?: string
          is_demand?: boolean | null
          like_count?: number | null
          media_pk: string
          sentiment?: string | null
          text?: string | null
          timestamp?: string | null
          username: string
        }
        Update: {
          analyzed_at?: string | null
          collected_at?: string
          comment_id?: string
          comment_username?: string | null
          demand_category?: string | null
          id?: string
          is_demand?: boolean | null
          like_count?: number | null
          media_pk?: string
          sentiment?: string | null
          text?: string | null
          timestamp?: string | null
          username?: string
        }
        Relationships: []
      }
      ig_media_metrics: {
        Row: {
          caption: string | null
          collected_at: string
          comment_count: number | null
          id: string
          impressions: number | null
          like_count: number | null
          media_code: string | null
          media_pk: string
          media_type: string | null
          play_count: number | null
          raw: Json | null
          reach: number | null
          save_count: number | null
          share_count: number | null
          snapshot_date: string
          taken_at: string | null
          thumbnail_url: string | null
          username: string
        }
        Insert: {
          caption?: string | null
          collected_at?: string
          comment_count?: number | null
          id?: string
          impressions?: number | null
          like_count?: number | null
          media_code?: string | null
          media_pk: string
          media_type?: string | null
          play_count?: number | null
          raw?: Json | null
          reach?: number | null
          save_count?: number | null
          share_count?: number | null
          snapshot_date?: string
          taken_at?: string | null
          thumbnail_url?: string | null
          username: string
        }
        Update: {
          caption?: string | null
          collected_at?: string
          comment_count?: number | null
          id?: string
          impressions?: number | null
          like_count?: number | null
          media_code?: string | null
          media_pk?: string
          media_type?: string | null
          play_count?: number | null
          raw?: Json | null
          reach?: number | null
          save_count?: number | null
          share_count?: number | null
          snapshot_date?: string
          taken_at?: string | null
          thumbnail_url?: string | null
          username?: string
        }
        Relationships: []
      }
      ig_online_followers: {
        Row: {
          collected_at: string
          hour: number
          id: string
          snapshot_date: string
          username: string
          value: number
          weekday: number
        }
        Insert: {
          collected_at?: string
          hour: number
          id?: string
          snapshot_date?: string
          username: string
          value: number
          weekday: number
        }
        Update: {
          collected_at?: string
          hour?: number
          id?: string
          snapshot_date?: string
          username?: string
          value?: number
          weekday?: number
        }
        Relationships: []
      }
      ig_post_themes: {
        Row: {
          analyzed_at: string
          media_pk: string
          summary: string | null
          theme: string
          username: string
        }
        Insert: {
          analyzed_at?: string
          media_pk: string
          summary?: string | null
          theme: string
          username: string
        }
        Update: {
          analyzed_at?: string
          media_pk?: string
          summary?: string | null
          theme?: string
          username?: string
        }
        Relationships: []
      }
      ig_profile_snapshots: {
        Row: {
          biography: string | null
          collected_at: string
          external_url: string | null
          followers: number
          following: number
          full_name: string | null
          id: string
          media_count: number
          profile_pic_url: string | null
          snapshot_date: string
          username: string
        }
        Insert: {
          biography?: string | null
          collected_at?: string
          external_url?: string | null
          followers?: number
          following?: number
          full_name?: string | null
          id?: string
          media_count?: number
          profile_pic_url?: string | null
          snapshot_date?: string
          username: string
        }
        Update: {
          biography?: string | null
          collected_at?: string
          external_url?: string | null
          followers?: number
          following?: number
          full_name?: string | null
          id?: string
          media_count?: number
          profile_pic_url?: string | null
          snapshot_date?: string
          username?: string
        }
        Relationships: []
      }
      ig_raw_insights: {
        Row: {
          collected_at: string
          id: string
          kind: string
          raw: Json
          username: string
        }
        Insert: {
          collected_at?: string
          id?: string
          kind: string
          raw: Json
          username: string
        }
        Update: {
          collected_at?: string
          id?: string
          kind?: string
          raw?: Json
          username?: string
        }
        Relationships: []
      }
      ig_story_metrics: {
        Row: {
          collected_at: string
          exits: number | null
          id: string
          impressions: number | null
          raw: Json | null
          reach: number | null
          replies: number | null
          story_pk: string
          taken_at: string | null
          taps_back: number | null
          taps_forward: number | null
          username: string
        }
        Insert: {
          collected_at?: string
          exits?: number | null
          id?: string
          impressions?: number | null
          raw?: Json | null
          reach?: number | null
          replies?: number | null
          story_pk: string
          taken_at?: string | null
          taps_back?: number | null
          taps_forward?: number | null
          username: string
        }
        Update: {
          collected_at?: string
          exits?: number | null
          id?: string
          impressions?: number | null
          raw?: Json | null
          reach?: number | null
          replies?: number | null
          story_pk?: string
          taken_at?: string | null
          taps_back?: number | null
          taps_forward?: number | null
          username?: string
        }
        Relationships: []
      }
      institutional_contacts: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          instituicao: string
          responsavel: string
          sigla: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          instituicao: string
          responsavel: string
          sigla?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          instituicao?: string
          responsavel?: string
          sigla?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          address: string
          age: string
          birth_date: string
          cnh_category: string | null
          course_certificates_url: string | null
          cpf: string
          created_at: string
          curriculum_url: string | null
          document_urls: string[] | null
          education: string
          email: string
          expected_salary: string | null
          full_name: string
          gender: string
          has_cnh: string
          has_transport: string
          holidays_available: string
          id: string
          marital_status: string
          nationality: string
          phone: string
          positions: string[]
          proof_of_residence_url: string | null
          relevant_courses: string | null
          rg: string
          rg_document_url: string | null
          saturday_afternoon: boolean | null
          saturday_morning: boolean | null
          saturday_night: boolean | null
          sunday_afternoon: boolean | null
          sunday_morning: boolean | null
          sunday_night: boolean | null
          webhook_sent: boolean | null
          webhook_sent_at: string | null
          weekday_afternoon: boolean | null
          weekday_morning: boolean | null
          weekday_night: boolean | null
        }
        Insert: {
          address: string
          age: string
          birth_date: string
          cnh_category?: string | null
          course_certificates_url?: string | null
          cpf: string
          created_at?: string
          curriculum_url?: string | null
          document_urls?: string[] | null
          education: string
          email: string
          expected_salary?: string | null
          full_name: string
          gender: string
          has_cnh: string
          has_transport: string
          holidays_available: string
          id?: string
          marital_status: string
          nationality: string
          phone: string
          positions: string[]
          proof_of_residence_url?: string | null
          relevant_courses?: string | null
          rg: string
          rg_document_url?: string | null
          saturday_afternoon?: boolean | null
          saturday_morning?: boolean | null
          saturday_night?: boolean | null
          sunday_afternoon?: boolean | null
          sunday_morning?: boolean | null
          sunday_night?: boolean | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
          weekday_afternoon?: boolean | null
          weekday_morning?: boolean | null
          weekday_night?: boolean | null
        }
        Update: {
          address?: string
          age?: string
          birth_date?: string
          cnh_category?: string | null
          course_certificates_url?: string | null
          cpf?: string
          created_at?: string
          curriculum_url?: string | null
          document_urls?: string[] | null
          education?: string
          email?: string
          expected_salary?: string | null
          full_name?: string
          gender?: string
          has_cnh?: string
          has_transport?: string
          holidays_available?: string
          id?: string
          marital_status?: string
          nationality?: string
          phone?: string
          positions?: string[]
          proof_of_residence_url?: string | null
          relevant_courses?: string | null
          rg?: string
          rg_document_url?: string | null
          saturday_afternoon?: boolean | null
          saturday_morning?: boolean | null
          saturday_night?: boolean | null
          sunday_afternoon?: boolean | null
          sunday_morning?: boolean | null
          sunday_night?: boolean | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
          weekday_afternoon?: boolean | null
          weekday_morning?: boolean | null
          weekday_night?: boolean | null
        }
        Relationships: []
      }
      lista_convidados: {
        Row: {
          data_entrada: string | null
          id: string
          lista_id: string
          nome: string
          status: string | null
        }
        Insert: {
          data_entrada?: string | null
          id?: string
          lista_id: string
          nome: string
          status?: string | null
        }
        Update: {
          data_entrada?: string | null
          id?: string
          lista_id?: string
          nome?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lista_convidados_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas"
            referencedColumns: ["id"]
          },
        ]
      }
      listas: {
        Row: {
          data_cadastro: string | null
          data_entrada: string | null
          data_evento: string | null
          fonte_lead: string | null
          id: string
          nome_responsavel: string
          status: string | null
          telefone: string
          tipo: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          data_cadastro?: string | null
          data_entrada?: string | null
          data_evento?: string | null
          fonte_lead?: string | null
          id?: string
          nome_responsavel: string
          status?: string | null
          telefone: string
          tipo: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          data_cadastro?: string | null
          data_entrada?: string | null
          data_evento?: string | null
          fonte_lead?: string | null
          id?: string
          nome_responsavel?: string
          status?: string | null
          telefone?: string
          tipo?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories_malu: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      news_reports: {
        Row: {
          autor: string | null
          categorias: string | null
          created_at: string | null
          data: string
          external_id: number | null
          id: number
          link: string | null
          mes_referencia: string
          titulo: string
        }
        Insert: {
          autor?: string | null
          categorias?: string | null
          created_at?: string | null
          data: string
          external_id?: number | null
          id?: number
          link?: string | null
          mes_referencia: string
          titulo: string
        }
        Update: {
          autor?: string | null
          categorias?: string | null
          created_at?: string | null
          data?: string
          external_id?: number | null
          id?: number
          link?: string | null
          mes_referencia?: string
          titulo?: string
        }
        Relationships: []
      }
      pautas_audit_log: {
        Row: {
          action: string
          changed_data: Json | null
          created_at: string
          event_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          changed_data?: Json | null
          created_at?: string
          event_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          changed_data?: Json | null
          created_at?: string
          event_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pautas_audit_log_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "pautas_events"
            referencedColumns: ["id"]
          },
        ]
      }
      pautas_events: {
        Row: {
          cor: string | null
          created_at: string | null
          criado_por: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          direcao_id: string[] | null
          editor_id: string[] | null
          filmmaker_id: string[] | null
          fotografo_id: string[] | null
          id: string
          jornalista_id: string[] | null
          local: string | null
          prioridade: Database["public"]["Enums"]["event_priority"] | null
          producao_id: string[] | null
          recorrencia: Database["public"]["Enums"]["event_recurrence"] | null
          rede_id: string[] | null
          responsavel_id: string | null
          source_event_id: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          tipo: Database["public"]["Enums"]["event_type"]
          titulo: string
          updated_at: string | null
        }
        Insert: {
          cor?: string | null
          created_at?: string | null
          criado_por: string
          data_fim: string
          data_inicio: string
          descricao?: string | null
          direcao_id?: string[] | null
          editor_id?: string[] | null
          filmmaker_id?: string[] | null
          fotografo_id?: string[] | null
          id?: string
          jornalista_id?: string[] | null
          local?: string | null
          prioridade?: Database["public"]["Enums"]["event_priority"] | null
          producao_id?: string[] | null
          recorrencia?: Database["public"]["Enums"]["event_recurrence"] | null
          rede_id?: string[] | null
          responsavel_id?: string | null
          source_event_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tipo: Database["public"]["Enums"]["event_type"]
          titulo: string
          updated_at?: string | null
        }
        Update: {
          cor?: string | null
          created_at?: string | null
          criado_por?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          direcao_id?: string[] | null
          editor_id?: string[] | null
          filmmaker_id?: string[] | null
          fotografo_id?: string[] | null
          id?: string
          jornalista_id?: string[] | null
          local?: string | null
          prioridade?: Database["public"]["Enums"]["event_priority"] | null
          producao_id?: string[] | null
          recorrencia?: Database["public"]["Enums"]["event_recurrence"] | null
          rede_id?: string[] | null
          responsavel_id?: string | null
          source_event_id?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tipo?: Database["public"]["Enums"]["event_type"]
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pautas_events_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pautas_events_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pautas_events_source_event_id_fkey"
            columns: ["source_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      pautas_participants: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pautas_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "pautas_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pautas_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          date: string
          email: string
          guests: number
          id: string
          name: string
          periodo: string
          phone: string
          special_requests: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          date: string
          email: string
          guests: number
          id?: string
          name: string
          periodo: string
          phone: string
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          email?: string
          guests?: number
          id?: string
          name?: string
          periodo?: string
          phone?: string
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      roadmap_suggestions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_votes: {
        Row: {
          created_at: string | null
          suggestion_id: string
          user_id: string
          vote: number
        }
        Insert: {
          created_at?: string | null
          suggestion_id: string
          user_id: string
          vote?: number
        }
        Update: {
          created_at?: string | null
          suggestion_id?: string
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "roadmap_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_absences: {
        Row: {
          created_at: string | null
          data_fim: string
          data_inicio: string
          id: string
          observacao: string | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_fim: string
          data_inicio: string
          id?: string
          observacao?: string | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          id?: string
          observacao?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_absences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          scopes: string[]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scopes?: string[]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scopes?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_loans: {
        Row: {
          created_at: string | null
          id: string
          km_final: number | null
          km_inicial: number
          loaned_at: string | null
          loaned_by: string | null
          notes: string | null
          returned_at: string | null
          returned_by: string | null
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          km_final?: number | null
          km_inicial: number
          loaned_at?: string | null
          loaned_by?: string | null
          notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          km_final?: number | null
          km_inicial?: number
          loaned_at?: string | null
          loaned_by?: string | null
          notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_loans_loaned_by_fkey"
            columns: ["loaned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_loans_returned_by_fkey"
            columns: ["returned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_loans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_loans_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          model: string
          name: string
          plate: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          model: string
          name: string
          plate: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          model?: string
          name?: string
          plate?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekend_teams: {
        Row: {
          chefe: string | null
          created_at: string | null
          designer: string | null
          edicao: string | null
          filmmaker: string[] | null
          fotografo: string[] | null
          id: string
          jornalistas: string[] | null
          notes: string | null
          rede: string[] | null
          tamoios: string[] | null
          updated_at: string | null
          weekend_key: string
        }
        Insert: {
          chefe?: string | null
          created_at?: string | null
          designer?: string | null
          edicao?: string | null
          filmmaker?: string[] | null
          fotografo?: string[] | null
          id?: string
          jornalistas?: string[] | null
          notes?: string | null
          rede?: string[] | null
          tamoios?: string[] | null
          updated_at?: string | null
          weekend_key: string
        }
        Update: {
          chefe?: string | null
          created_at?: string | null
          designer?: string | null
          edicao?: string | null
          filmmaker?: string[] | null
          fotografo?: string[] | null
          id?: string
          jornalistas?: string[] | null
          notes?: string | null
          rede?: string[] | null
          tamoios?: string[] | null
          updated_at?: string | null
          weekend_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekend_teams_chefe_fkey"
            columns: ["chefe"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekend_teams_designer_fkey"
            columns: ["designer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekend_teams_edicao_fkey"
            columns: ["edicao"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: { Args: { data: string }; Returns: string }
      cleanup_old_conversations: { Args: never; Returns: undefined }
      create_board_safe: {
        Args: {
          board_description?: string
          board_owner_id?: string
          board_title: string
          board_visibility?: Database["public"]["Enums"]["board_visibility"]
        }
        Returns: {
          created_at: string
          description: string
          id: string
          owner_id: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["board_visibility"]
        }[]
      }
      delete_user_admin: { Args: { user_id_to_delete: string }; Returns: Json }
      event_is_accessible: { Args: { _event_id: string }; Returns: boolean }
      get_board_data: { Args: { board_uuid: string }; Returns: Json }
      get_card_board_id: { Args: { p_card_id: string }; Returns: string }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_reservations_status: {
        Args: { target_date: string }
        Returns: {
          capacity: number
          reservation_date: string
          reservations_count: number
          seats_booked: number
          seats_remaining: number
        }[]
      }
      get_reservations_status_by_period: {
        Args: { target_date: string }
        Returns: {
          capacity: number
          reservation_date: string
          seats_booked_noite: number
          seats_booked_tarde: number
          seats_booked_total: number
          seats_remaining_noite: number
          seats_remaining_tarde: number
          seats_remaining_total: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_scope: { Args: { scope: string }; Returns: boolean }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_board_member: {
        Args: { p_board_id: string; p_user_id: string }
        Returns: boolean
      }
      is_user_participant: {
        Args: { _event: string; _user: string }
        Returns: boolean
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_julia:
        | {
            Args: {
              filter?: Json
              match_count?: number
              query_embedding: string
            }
            Returns: {
              content: string
              id: number
              metadata: Json
              similarity: number
            }[]
          }
        | {
            Args: {
              match_threshold?: number
              max_limit?: number
              query_embedding: string
            }
            Returns: {
              content: string
              id: number
              metadata: Json
              similarity: number
            }[]
          }
      match_documentsmalu: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      send_daily_pautas_webhook: { Args: never; Returns: undefined }
      send_weekly_fds_webhook: { Args: never; Returns: undefined }
      test_daily_pautas_webhook: { Args: never; Returns: Json }
      test_weekly_fds_webhook: { Args: never; Returns: Json }
      text_to_bytea: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      user_has_board_access: { Args: { board_uuid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "guest"
      board_visibility: "private" | "team" | "public"
      card_priority: "low" | "medium" | "high"
      event_priority: "baixa" | "media" | "alta"
      event_recurrence: "nenhuma" | "diaria" | "semanal" | "mensal"
      event_status: "pendente" | "em_andamento" | "concluido" | "cancelado"
      event_type: "reuniao" | "tarefa" | "escala" | "evento"
      lead_status: "aguardando" | "entrou"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
    Enums: {
      app_role: ["admin", "user", "guest"],
      board_visibility: ["private", "team", "public"],
      card_priority: ["low", "medium", "high"],
      event_priority: ["baixa", "media", "alta"],
      event_recurrence: ["nenhuma", "diaria", "semanal", "mensal"],
      event_status: ["pendente", "em_andamento", "concluido", "cancelado"],
      event_type: ["reuniao", "tarefa", "escala", "evento"],
      lead_status: ["aguardando", "entrou"],
    },
  },
} as const
