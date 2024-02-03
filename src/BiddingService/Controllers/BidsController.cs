using AutoMapper;
using BiddingService.DTO;
using BiddingService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public BidsController(IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BidDTO>> PlaceBid(string auctionId, int amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);
        if (auction == null) return NotFound();
        if (auction.Seller == User.Identity.Name)
        {
            return BadRequest("Невозможно подать предложение для собственного аукциона");
        }

        var bid = new Bid
        {
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User.Identity.Name
        };

        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Завершено;
        }
        else
        {
            var highBid = await DB.Find<Bid>()
                .Match(p => p.AuctionId == auctionId)
                .Sort(p => p.Descending(x => x.Amount))
                .ExecuteFirstAsync();

            if (highBid != null && amount > highBid.Amount || highBid == null)
            {
                bid.BidStatus = amount > auction.ReservePrice ?
                BidStatus.Принято :
                BidStatus.ПринятоНижеНачальнойСтавки;
            }

            if (highBid != null && bid.Amount <= highBid.Amount)
            {
                bid.BidStatus = BidStatus.СлишкомНизкая;
            }
        }

        await DB.SaveAsync(bid);

        await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

        return Ok(_mapper.Map<BidDTO>(bid));
    }

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<BidDTO>>> GetBidsForAuction(string auctionId)
    {
        var bids = await DB.Find<Bid>()
            .Match(p => p.AuctionId == auctionId)
            .Sort(p => p.Descending(x => x.BidTime))
            .ExecuteAsync();

        return bids.Select(_mapper.Map<BidDTO>).ToList();
    }
}