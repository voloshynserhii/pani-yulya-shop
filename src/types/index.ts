interface Order {
  reference?: string
  amount?: number
  currency: string
  status?: string
  productType?: string
  productData: { childName?: string, childNameCute?: string, age?: number, birthday?: string, trackIds?: string[], toyIds?: string[], imageUrls?: string[] },
  contacts: { email: string, telegram?: string },
  orderDate: Date,
  userEmail?: string,
}

interface FormData {
  childName: string
  childNameCute: string
  age: number
  birthday: string
  telegram: string
  email: string
}

interface MusicTrack {
  trackId: string;
  title: string;
  coverSrc: string;
  hasAccess?: boolean;
  price: number;
}

export type { Order, FormData, MusicTrack }