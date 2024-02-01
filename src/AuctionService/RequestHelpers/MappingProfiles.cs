using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;
using Contracts;

namespace AuctionService.RequestHelpers;

public class MappingProfiles: Profile
{
    public MappingProfiles()
    {
        CreateMap<Auction, AuctionDTO>();
        CreateMap<Item, AuctionDTO>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.Image != null && src.Image.Length > 0)
                    {
                        dest.Image = Convert.ToBase64String(src.Image);                      
                    }
                    return dest.Image;
                })
            );
        CreateMap<CreateAuctionDTO, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));

        CreateMap<CreateAuctionDTO, Item>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.Image != null && src.Image.Length > 0)
                    {
                        dest.Image = Convert.FromBase64String(src.Image.Replace("data:image/jpeg;base64,",""));
                    }
                    return dest.Image;
                })
            );

        CreateMap<AuctionDTO, AuctionCreated>();
        CreateMap<Auction, AuctionUpdated>().IncludeMembers(p => p.Item);
        CreateMap<Item, AuctionUpdated>()
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src != null && src.Image != null && src.Image.Length > 0)
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
                        dest.Image = Convert.FromBase64String(src.Image.Replace("data:image/jpeg;base64,",""));
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
