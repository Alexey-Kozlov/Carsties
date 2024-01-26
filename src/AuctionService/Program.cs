using AuctionService.Consumers;
using AuctionService.Data;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
        config.Host(builder.Configuration["RabbitMq:Host"], "/", p =>
        {
            p.Username(builder.Configuration.GetValue("RabbitMq:UserName","guest"));
            p.Password(builder.Configuration.GetValue("RabbitMq:Password","guest"));
        });
        config.ConfigureEndpoints(context);
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "login";
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthentication();
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
