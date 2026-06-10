
export enum PROFILE_TYPE { SELLER = 'seller', USER = 'user' }

export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    avatarUrl?: string;
    type: PROFILE_TYPE;
    createdAt: Date;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    sellerId: string;
    sellerName?: string;
    commentCount?:number;
    createdAt: any; // Firestore timestamp
}
export interface Message{
  message : string;
  createdAt: any;
  senderId: string;
}
export interface Chat {
    id: string;
    productId?: string;
    usersIds: string[];
    title: string;
    messages: Message[]
    createdAt: any;
}

