import { OnboardingState } from './types';

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  shopInfo: {
    name: 'Bella Italia Bistro',
    tagline: 'Artisanal Wood-Fired Pizza & Homemade Pasta',
    description: 'Serving authentic Neapolitan pizza baked in our traditional stone oven, fresh handmade pasta, crisp garden salads, and Italian desserts crafted with passion.',
    cuisineType: 'Italian & Mediterranean',
    phone: '+1 (555) 234-5678',
    email: 'contact@bellaitaliabistro.com',
    currency: '$',
    bannerColor: '#0284c7'
  },
  location: {
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Suite 104 - Ground Floor',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
    latitude: 44.0462,
    longitude: -123.0220,
    deliveryNotes: 'Deliveries to side entrance near the customer parking lot.'
  },
  weekdayTimings: [
    { day: 'Monday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Tuesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Wednesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Thursday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Friday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { day: 'Saturday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { day: 'Sunday', isOpen: true, openTime: '12:00', closeTime: '21:00' }
  ],
  holidayTimings: [
    {
      id: 'h1',
      name: 'Thanksgiving Day',
      date: '2026-11-26',
      isOpen: false,
      note: 'Closed for Thanksgiving'
    },
    {
      id: 'h2',
      name: 'Christmas Eve',
      date: '2026-12-24',
      isOpen: true,
      openTime: '11:00',
      closeTime: '18:00',
      note: 'Special holiday early closing'
    },
    {
      id: 'h3',
      name: 'New Year Day',
      date: '2027-01-01',
      isOpen: true,
      openTime: '13:00',
      closeTime: '22:00',
      note: 'Late opening for brunch & dinner'
    }
  ],
  menuItems: [
    {
      id: 'item-1',
      name: 'Margherita Pizza',
      price: 14.99,
      category: 'Mains',
      description: 'Classic tomato base with fresh mozzarella and hand torn basil.',
      available: true,
      dietary: ['Vegetarian']
    },
    {
      id: 'item-2',
      name: 'Crispy Chicken Burger',
      price: 12.50,
      category: 'Mains',
      description: 'Buttermilk-fried chicken with shredded lettuce, tomato and smoky aioli.',
      available: true,
      dietary: ['Halal']
    },
    {
      id: 'item-3',
      name: 'Pasta Carbonara',
      price: 16.99,
      category: 'Mains',
      description: 'Spaghetti with pancetta, egg yolk, aged pecorino and cracked black pepper.',
      available: true
    },
    {
      id: 'item-4',
      name: 'Caesar Salad',
      price: 9.99,
      category: 'Salads',
      description: 'Romaine hearts, sourdough croutons, shaved parmesan, house caesar dressing.',
      available: true,
      dietary: ['Vegetarian']
    },
    {
      id: 'item-5',
      name: 'Tiramisu',
      price: 7.50,
      category: 'Desserts',
      description: 'Mascarpone cream, espresso soaked ladyfingers, dusted with cocoa.',
      available: true,
      dietary: ['Vegetarian']
    },
    {
      id: 'item-6',
      name: 'Classic Soft Drink',
      price: 3.50,
      category: 'Drinks',
      description: 'Coke, Sprite or Fanta — your choice, served chilled over ice.',
      available: true,
      dietary: ['Vegan']
    }
  ],
  delivery: {
    selfPickup: true,
    deliveryToClient: true,
    ownDelivery: {
      enabled: true,
      radiusKm: 7.5,
      deliveryFee: 3.99,
      minOrderAmount: 15.00,
      estimatedMinutes: 35
    },
    thirdParty: {
      enabled: false,
      provider: 'doordash_drive',
      partnerName: 'DoorDash Drive Integration',
      apiKey: '',
      webhookUrl: 'https://api.wejoinlife.com/webhooks/delivery/doordash',
      autoDispatch: true
    },
    uberEats: {
      enabled: false,
      storeUuid: 'ue-store-8924-f901',
      merchantId: 'merchant_bella_99',
      autoAcceptOrders: true,
      menuSync: true
    },
    dineIn: {
      enabled: true,
      tableCount: 12,
      enableTableQr: true
    }
  },
  payment: {
    cashOnDelivery: true,
    stripe: {
      enabled: true,
      publishableKey: 'pk_test_51Mz982ExampleStripePublishableKey999',
      testMode: true
    },
    paypal: {
      enabled: true,
      clientId: 'sb-client-id-sample-88329',
      sandbox: true
    }
  },
  combosEnabled: true,
  combos: [
    {
      id: 'combo-1',
      name: 'Lunch Express Combo',
      price: 18.00,
      itemIds: ['item-1', 'item-6'],
      description: 'Margherita Pizza with a chilled Classic Soft Drink.'
    }
  ]
};
