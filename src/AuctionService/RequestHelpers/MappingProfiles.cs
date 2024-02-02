using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;
using Contracts;

namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Auction, AuctionDTO>().IncludeMembers(p => p.Item);
        CreateMap<ICollection<Item>, AuctionDTO>()
            .ForMember(dest => dest.Make, opt => opt.MapFrom(src => src.FirstOrDefault().Make))
            .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.FirstOrDefault().Model))
            .ForMember(dest => dest.Year, opt => opt.MapFrom(src => src.FirstOrDefault().Year))
            .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.FirstOrDefault().Color))
            .ForMember(dest => dest.Mileage, opt => opt.MapFrom(src => src.FirstOrDefault().Mileage))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.FirstOrDefault().ImageUrl))
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
            {
                if (src.FirstOrDefault().Image != null && src.FirstOrDefault().Image.Length > 0)
                {
                    dest.Image = Convert.ToBase64String(src.FirstOrDefault().Image);
                }
                return dest.Image;
            }));

        CreateMap<CreateAuctionDTO, Auction>().ForMember(d => d.Item, 
            o => o.MapFrom(s => new List<Item>{
                new() {
                    Make = s.Make,
                    Model = s.Model,
                    Mileage = s.Mileage,
                    Year = s.Year,
                    Color = s.Color,
                    ImageUrl = s.ImageUrl,
                    Image = Convert.FromBase64String(s.Image.Replace("data:image/jpeg;base64,", ""))
                }
            }));

        CreateMap<AuctionDTO, AuctionCreated>();
        CreateMap<Auction, AuctionUpdated>().IncludeMembers(p => p.Item);
        CreateMap<ICollection<Item>, AuctionUpdated>()
            .ForMember(dest => dest.Make, opt => opt.MapFrom(src => src.FirstOrDefault().Make))
            .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.FirstOrDefault().Model))
            .ForMember(dest => dest.Year, opt => opt.MapFrom(src => src.FirstOrDefault().Year))
            .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.FirstOrDefault().Color))
            .ForMember(dest => dest.Mileage, opt => opt.MapFrom(src => src.FirstOrDefault().Mileage))
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
            {
                if (src.FirstOrDefault().Image != null && src.FirstOrDefault().Image.Length > 0)
                {
                    dest.Image = Convert.ToBase64String(src.FirstOrDefault().Image);
                }
                return dest.Image;
            }));

        CreateMap<UpdateAuctionDTO, Auction>().ForMember(d => d.Item, 
            o => o.MapFrom((src, dest) => 
            {
                return new List<Item>
                {
                new() {
                    Make = src.Make ?? dest.Item.First().Make,
                    Model = src.Model ?? dest.Item.First().Model,
                    Mileage = src.Mileage ?? dest.Item.First().Mileage,
                    Year = src.Year ?? dest.Item.First().Year,
                    Color = src.Color ?? dest.Item.First().Color,
                    ImageUrl = src.ImageUrl ?? dest.Item.First().ImageUrl,
                    Image = (src.Image != null && src.Image.Length > 0) ? 
                        Convert.FromBase64String(src.Image.Replace("data:image/jpeg;base64,", "")) :
                        dest.Item.First().Image
                }
                };
            }));
     }
}
