﻿using AuctionService.Entities;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuctionService.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Auction> Auctions {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new AuctionConfiguration());
        modelBuilder.ApplyConfiguration(new ItemConfiguration());
        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }

}

public class AuctionConfiguration : IEntityTypeConfiguration<Auction>
{
    public void Configure(EntityTypeBuilder<Auction> builder)
    {
        builder.ToTable("Auction").HasKey(p => p.Id).HasName("Id");
        builder.Property(p => p.Id).HasColumnType("uuid").HasColumnName("Id").IsRequired(true);
        builder.Property(p => p.ReservePrice).HasColumnType("integer").HasColumnName("ReservePrice").IsRequired(true);
        builder.Property(p => p.Seller).HasColumnType("text").HasColumnName("Seller").IsRequired(false);
        builder.Property(p => p.Winner).HasColumnType("text").HasColumnName("Winner").IsRequired(false);
        builder.Property(p => p.SoldAmount).HasColumnType("integer").HasColumnName("SoldAmount").IsRequired(false);
        builder.Property(p => p.CurrentHighBid).HasColumnType("integer").HasColumnName("CurrentHighBid").IsRequired(false);
        builder.Property(p => p.CreateAt).HasColumnType("timestamp with time zone").HasColumnName("CreateAt").IsRequired(true);
        builder.Property(p => p.UpdatedAt).HasColumnType("timestamp with time zone").HasColumnName("UpdatedAt").IsRequired(true);
        builder.Property(p => p.AuctionEnd).HasColumnType("timestamp with time zone").HasColumnName("AuctionEnd").IsRequired(false);
        builder.Property(p => p.Status).HasColumnType("integer").HasColumnName("Status").IsRequired(true);

        builder.HasIndex(p => p.Id).HasDatabaseName("PK_Auctions");
    }
}

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.ToTable("Items").HasKey(p => p.Id).HasName("PK_Id");
        builder.Property(p => p.Id).HasColumnType("uuid").HasColumnName("Id").IsRequired(true);
        builder.Property(p => p.Make).HasColumnType("text").HasColumnName("Make").IsRequired(false);
        builder.Property(p => p.Model).HasColumnType("text").HasColumnName("Model").IsRequired(false);
        builder.Property(p => p.Year).HasColumnType("integer").HasColumnName("Yesr").IsRequired(true);
        builder.Property(p => p.Color).HasColumnType("text").HasColumnName("Color").IsRequired(false);
        builder.Property(p => p.Mileage).HasColumnType("integer").HasColumnName("Mileage").IsRequired(true);
        builder.Property(p => p.ImageUrl).HasColumnType("text").HasColumnName("ImageUrl").IsRequired(false);
        builder.Property(p => p.Image).HasColumnType("bytea").HasColumnName("Image").IsRequired(false);

        builder.Property(p => p.AuctionId).HasColumnType("uuid").HasColumnName("AuctionId").IsRequired(true);
        builder.HasOne(p => p.Auction).WithMany(p => p.Item).HasForeignKey(p => p.AuctionId);
        builder.HasIndex(p => p.Id).HasDatabaseName("PK_Items");
        builder.HasIndex(p => p.AuctionId).HasDatabaseName("FK_Items_Auctions_AuctionId");
    }
}
