export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          domain: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name: string;
          domain: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string;
          domain?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          school_id: string | null;
          avatar_url: string | null;
          subscription_tier: string;
          year: string | null;
          major: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          school_id?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
          year?: string | null;
          major?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          school_id?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
          year?: string | null;
          major?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          school_id: string | null;
          type: 'housing' | 'marketplace';
          title: string;
          description: string;
          price: number;
          status: 'available' | 'pending' | 'sold';
          created_at: string;
          updated_at: string;
          // Housing fields
          location: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          available_from: string | null;
          available_to: string | null;
          gender_pref: string | null;
          housing_type: string | null;
          distance_from_campus: number | null;
          // Marketplace fields
          category: string | null;
          condition: string | null;
          view_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          school_id?: string | null;
          type: 'housing' | 'marketplace';
          title: string;
          description: string;
          price: number;
          status?: 'available' | 'pending' | 'sold';
          created_at?: string;
          updated_at?: string;
          location?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          available_from?: string | null;
          available_to?: string | null;
          gender_pref?: string | null;
          housing_type?: string | null;
          distance_from_campus?: number | null;
          category?: string | null;
          condition?: string | null;
          view_count?: number;
        };
        Update: {
          type?: 'housing' | 'marketplace';
          title?: string;
          description?: string;
          price?: number;
          status?: 'available' | 'pending' | 'sold';
          updated_at?: string;
          location?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          available_from?: string | null;
          available_to?: string | null;
          gender_pref?: string | null;
          housing_type?: string | null;
          distance_from_campus?: number | null;
          category?: string | null;
          condition?: string | null;
          view_count?: number;
        };
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          url: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          url: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          url?: string;
          position?: number;
        };
      };
      saved_listings: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {};
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          updated_at?: string;
        };
      };
      listing_views: {
        Row: {
          id: string;
          listing_id: string;
          viewer_id: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          viewer_id?: string | null;
          viewed_at?: string;
        };
        Update: {};
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
    };
  };
}

// Convenience type aliases
export type School = Database['public']['Tables']['schools']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type DbListing = Database['public']['Tables']['listings']['Row'];
export type ListingImage = Database['public']['Tables']['listing_images']['Row'];
export type SavedListing = Database['public']['Tables']['saved_listings']['Row'];
export type DbConversation = Database['public']['Tables']['conversations']['Row'];
export type DbMessage = Database['public']['Tables']['messages']['Row'];

// Listing with joined data for the frontend
export interface ListingWithImages extends DbListing {
  listing_images: ListingImage[];
  profiles?: Pick<Profile, 'full_name' | 'avatar_url'>;
}
