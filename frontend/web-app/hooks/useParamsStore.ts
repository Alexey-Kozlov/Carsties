import { create } from "zustand";

type State = {
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    searchTerm: string;
    searchValue: string;
    orderBy: string;
    filterBy: string;
}

type Auction = {
    setParams: (params: Partial<State>) => void;
    reset: () => void;
    setSearchValue:(value: string) => void;
}

const initialState: State = {
    pageNumber:1,
    pageSize:4,
    pageCount:1,
    searchTerm:'',
    searchValue:'',
    orderBy:'new',
    filterBy: 'live'
}

export const useParamsStore = create<State & Auction>()((set) => ({
    ...initialState,
    setParams:(newParams: Partial<State>) => {
        set((state) =>{
            if(newParams.pageNumber){
                return {...state, pageNumber: newParams.pageNumber}
            } else {
                return {...state, ...newParams, pageNumber: 1}
            }
        });
    },
    reset:() => set(initialState),
    setSearchValue:(value: string) => {
        set({searchValue: value});
    }
}));