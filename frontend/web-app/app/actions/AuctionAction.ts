"use server";

import { Auction, Bid, PagedResult } from "@/types";
import { getTokenWorkaround } from "./AuthActions";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

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

export const getDetailedViewData = async (id: string) : Promise<Auction> => {
  return await fetchWrapper.get(`auctions/${id}`);
}

export const updateAuction = async (data:FieldValues, id: string) => {
  const res = await fetchWrapper.put(`auctions/${id}`, data);
  revalidatePath(`/auctions/${id}`); //обновляем страничку в кеше
  return res;
}

export const deleteAuction = async (id:string) => {
  const res = await fetchWrapper.del(`auctions/${id}`);
  revalidatePath(`/auctions/${id}`);
  return res;
}

export const getBidsForAuction = async (id: string) : Promise<Bid[]> => {
  return await fetchWrapper.get(`bids/${id}`);
}

export const placeBidForAuction = async (auctionId: string, amount: number) =>{
  return await fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`,{});
}