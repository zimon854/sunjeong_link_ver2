export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: number;
          title: string;
          brand: string;
          category: string;
          price: number;
          image: string;
          shopify_url: string;
          status: string;
          participants: number;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          brand: string;
          category: string;
          price: number;
          image?: string;
          shopify_url?: string;
          status?: string;
          participants?: number;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          brand?: string;
          category?: string;
          price?: number;
          image?: string;
          shopify_url?: string;
          status?: string;
          participants?: number;
          description?: string;
          updated_at?: string;
        };
      };
      influencers: {
        Row: {
          id: string;
          name: string;
          avatar: string;
          country: string;
          country_code: string;
          follower_count: number;
          categories: string[];
          campaigns_count: number;
          rating: number;
          bio: string;
          is_online: boolean;
          social_handles: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar?: string;
          country: string;
          country_code: string;
          follower_count?: number;
          categories?: string[];
          campaigns_count?: number;
          rating?: number;
          bio?: string;
          is_online?: boolean;
          social_handles?: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string;
          country?: string;
          country_code?: string;
          follower_count?: number;
          categories?: string[];
          campaigns_count?: number;
          rating?: number;
          bio?: string;
          is_online?: boolean;
          social_handles?: Record<string, string>;
          updated_at?: string;
        };
      };
      campaign_participants: {
        Row: {
          id: number;
          campaign_id: number;
          influencer_id: string;
          status: string;
          content_url: string;
          content_caption: string;
          approval_status: string;
          performance_metrics: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          campaign_id: number;
          influencer_id: string;
          status?: string;
          content_url?: string;
          content_caption?: string;
          approval_status?: string;
          performance_metrics?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          campaign_id?: number;
          influencer_id?: string;
          status?: string;
          content_url?: string;
          content_caption?: string;
          approval_status?: string;
          performance_metrics?: Record<string, any>;
          updated_at?: string;
        };
      };
      campaign_reviews: {
        Row: {
          id: number;
          campaign_id: number;
          reviewer_id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          campaign_id: number;
          reviewer_id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          campaign_id?: number;
          reviewer_id?: string;
          reviewer_name?: string;
          rating?: number;
          comment?: string;
        };
      };
      messages: {
        Row: {
          id: number;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
