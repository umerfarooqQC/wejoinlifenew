export interface ShopInfo {
  name: string;
  tagline: string;
  description: string;
  cuisineType: string;
  phone: string;
  email: string;
  currency: string;
  bannerColor: string;
}

export interface LocationInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  deliveryNotes?: string;
}

export interface WeekdayTiming {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface HolidayTiming {
  id: string;
  name: string;
  date: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  note?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
  dietary?: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal')[];
}

export interface OwnDeliveryConfig {
  enabled: boolean;
  radiusKm: number;
  deliveryFee: number;
  minOrderAmount: number;
  estimatedMinutes: number;
}

export interface ThirdPartyDeliveryConfig {
  enabled: boolean;
  provider: 'doordash_drive' | 'stuart' | 'shipday' | 'other';
  partnerName: string;
  apiKey: string;
  webhookUrl: string;
  autoDispatch: boolean;
}

export interface UberEatsConfig {
  enabled: boolean;
  storeUuid: string;
  merchantId: string;
  autoAcceptOrders: boolean;
  menuSync: boolean;
}

export interface DineInConfig {
  enabled: boolean;
  tableCount: number;
  enableTableQr: boolean;
}

export interface DeliveryConfig {
  selfPickup: boolean;
  deliveryToClient: boolean;
  ownDelivery: OwnDeliveryConfig;
  thirdParty: ThirdPartyDeliveryConfig;
  uberEats: UberEatsConfig;
  dineIn: DineInConfig;
}

export interface StripeConfig {
  enabled: boolean;
  publishableKey: string;
  testMode: boolean;
}

export interface PayPalConfig {
  enabled: boolean;
  clientId: string;
  sandbox: boolean;
}

export interface PaymentConfig {
  cashOnDelivery: boolean;
  stripe: StripeConfig;
  paypal: PayPalConfig;
}

export interface ComboItem {
  id: string;
  name: string;
  price: number;
  itemIds: string[];
  description?: string;
}

export interface OnboardingState {
  shopInfo: ShopInfo;
  location: LocationInfo;
  weekdayTimings: WeekdayTiming[];
  holidayTimings: HolidayTiming[];
  menuItems: MenuItem[];
  delivery: DeliveryConfig;
  payment: PaymentConfig;
  combosEnabled: boolean;
  combos: ComboItem[];
}
