using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;

namespace AuctionService.RequestHelpers;

public class MappingProfiles: Profile
{
    public MappingProfiles()
    {
        CreateMap<Auction, AuctionDTO>().IncludeMembers(p => p.Item);
        CreateMap<Item, AuctionDTO>();
        CreateMap<CreateAuctionDTO, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));
        CreateMap<CreateAuctionDTO, Item>();
    }
}
