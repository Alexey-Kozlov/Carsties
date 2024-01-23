using AuctionService.Consumers;
using AuctionService.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(p => 
{
    p.AddEntityFrameworkOutbox<AuctionDbContext>(config =>
    {
        config.QueryDelay = TimeSpan.FromSeconds(10);
        config.UsePostgres();
        config.UseBusOutbox();
    });
    p.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
    p.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));
    p.UsingRabbitMq((context, config) => 
    {
        config.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

try
{
    DbInit.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine("Ошибка инициализации БД Auction - " + e.Message);
}

app.Run();
