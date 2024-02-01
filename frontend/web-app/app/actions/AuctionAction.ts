"use server";

import { Auction, PagedResult } from "@/types";
import { getTokenWorkaround } from "./AuthActions";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";

export async function getData(query: string): Promise<PagedResult<Auction>> {
  return await fetchWrapper.get(`search${query}`);
}

export const updateAuctionTest = async () => {
  const token = await getTokenWorkaround();
  const someData = { Mileage: Math.floor(Math.random() * 10000) + 1 };
  return await fetchWrapper.put('auctions/3659ac24-29dd-407a-81f5-ecfe6f924b9b',someData);
};

export const createAuction = async (data: FieldValues) => {
  return await fetchWrapper.post('auctions', data);
}
