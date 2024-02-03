export type PagedResult<T> = {
    results: T[];
    pageCount: number;
    totalCount: number;
}

export type Auction = {
    reservePrice: number;
    seller: string;
    winner?: string;
    soldAmount: number;
    currentHighBid: number;
    createAt: string;
    updatedAt: string;
    auctionEnd: string;
    status: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    description?: string;
    image?: string;
    id: string;
  }