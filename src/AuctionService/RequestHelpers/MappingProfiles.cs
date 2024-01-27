using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;

namespace AuctionService.RequestHelpers;

public class MappingProfiles: Profile
{
    public MappingProfiles()
    {
        CreateMap<Auction, AuctionDTO>().IncludeMembers(p => p.Item);
        CreateMap<Item, AuctionDTO>();
        CreateMap<CreateAuctionDTO, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));

        CreateMap<CreateAuctionDTO, Item>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.Image != null && src.Image.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            src.Image.CopyTo(ms);
                            dest.Image = ms.ToArray();
                        }
                    }
                    return dest.Image;
                })
            );

        CreateMap<AuctionDTO, AuctionCreated>();
        CreateMap<Auction, AuctionUpdated>().IncludeMembers(p => p.Item);
        CreateMap<Item, AuctionUpdated>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.Image != null && src.Image.Length > 0)
                    {
                        dest.Image = Convert.ToBase64String(src.Image);                        
                    }
                    return dest.Image;
                })
            );
        CreateMap<UpdateAuctionDTO, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));
        CreateMap<UpdateAuctionDTO, Item>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.Image != null && src.Image.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            src.Image.CopyTo(ms);
                            dest.Image = ms.ToArray();
                        }
                    }
                    return dest.Image;
                })
            )
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom((src, dest) => src.ImageUrl ?? dest.ImageUrl))
            .ForMember(dest => dest.Make, opt => opt.MapFrom((src, dest) => src.Make ?? dest.Make))
            .ForMember(dest => dest.Model, opt => opt.MapFrom((src, dest) => src.Model ?? dest.Model))
            .ForMember(dest => dest.Color, opt => opt.MapFrom((src, dest) => src.Color ?? dest.Color))
            .ForMember(dest => dest.Mileage, opt => opt.MapFrom((src, dest) => src.Mileage ?? dest.Mileage))
            .ForMember(dest => dest.Year, opt => opt.MapFrom((src, dest) => src.Year ?? dest.Year));
    }
}
