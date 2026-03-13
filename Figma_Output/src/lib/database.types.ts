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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          school_id?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
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
    };
  };
}

// Convenience type aliases
export type School = Database['public']['Tables']['schools']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type DbListing = Database['public']['Tables']['listings']['Row'];
export type ListingImage = Database['public']['Tables']['listing_images']['Row'];
export type SavedListing = Database['public']['Tables']['saved_listings']['Row'];

// Listing with joined data for the frontend
export interface ListingWithImages extends DbListing {
  listing_images: ListingImage[];
  profiles?: Pick<Profile, 'full_name' | 'avatar_url'>;
}
