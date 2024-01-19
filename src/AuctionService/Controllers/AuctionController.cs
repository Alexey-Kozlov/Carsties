using AuctionService.Data;
using AuctionService.DTO;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDTO>>> GetAllAuctions()
    {
        var auctions = await _context.Auctions
            .Include(p => p.Item)
            .OrderBy(p => p.Item.Make)
            .ToListAsync();

        return _mapper.Map<List<AuctionDTO>>(auctions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDTO>> GetAuctionById(Guid id)
    {
        var auction = await _context.Auctions
            .Include(p => p.Item)
            .FirstOrDefaultAsync(p => p.Id == id);

        if(auction == null) return NotFound();

        return _mapper.Map<AuctionDTO>(auction);
    }

    [HttpPost]
    public async Task<ActionResult<AuctionDTO>> CreateAuction(CreateAuctionDTO auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        auction.Seller = "test";
        _context.Auctions.Add(auction);
        var result = await _context.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Error save auction");
        return CreatedAtAction(nameof(GetAuctionById), new {auction.Id}, _mapper.Map<AuctionDTO>(auction));
    }
}
