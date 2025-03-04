export interface PopularAccommodation {
  id: string;
  name: string;
  properties: {
    description: string;
    name: string;
    extracted_hotel_class: number;
    total_rate: {
      lowest: string;
      extracted_lowest: number;
      before_taxes_fees: string;
      extracted_before_taxes_fees: number;
    };
    gps_coordinates: {
      latitude: number;
      longitude: number;
    };
    check_in_time: string;
    check_out_time: string;
    nearby_places: {
      name: string;
      transportations: {
        type: string;
        duration: string;
      }[];
    }[];
    type: string;
    images: {
      thumbnail: string;
      original_image: string;
    }[];
    rate_per_night: {
      lowest: string;
      extracted_lowest: number;
      before_taxes_fees: string;
      extracted_before_taxes_fees: number;
    };
    location_rating: number;
    ratings: {
      stars: number;
      count: number;
    };
    reviews_breakdown: {
      name: string;
      description: string;
      total_mentioned: number;
      positive: number;
      negative: number;
      neutral: number;
    }[];
    hotel_class: string;
    overall_rating: number;
    reviews: number;
    amenities: string[];
    link: string;
  }[];
}
