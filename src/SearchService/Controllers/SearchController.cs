using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;
using ZstdSharp.Unsafe;

namespace SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController: ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems([FromQuery] SearchParams searchParams)
    {
        var query = DB.PagedSearch<Item, Item>();

        if(!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
        }

        //сортировка в зависимости от текстового параметра OrderBy
        query = searchParams.OrderBy switch
        {
            "make" => query.Sort(p => p.Ascending(a => a.Make)),
            "new" => query.Sort(p => p.Descending(a => a.CreateAt)),
            _ => query.Sort(p => p.Ascending(a => a.AuctionEnd))
        };

        //отбор в зависимости от текстового параметра FilterBy
        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(p => p.AuctionEnd < DateTime.UtcNow),
            "endingSoon" => query.Match(p => p.AuctionEnd < DateTime.UtcNow.AddHours(6)
                && p.AuctionEnd > DateTime.UtcNow),
            _ => query.Match(p => p.AuctionEnd > DateTime.UtcNow)
        };

        if(!string.IsNullOrEmpty(searchParams.Seller))
        {
            query.Match(p => p.Seller == searchParams.Seller);
        }

        if(!string.IsNullOrEmpty(searchParams.Winner))
        {
            query.Match(p => p.Winner == searchParams.Winner);
        }

        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);
        
        var result = await query.ExecuteAsync();

        return Ok(
            new {
                results = result.Results,
                pageCount = result.PageCount,
                totalCount = result.TotalCount
            }
        );
    }
}