using CarRentalMoveZ.Data;
using CarRentalMoveZ.Models;
using CarRentalMoveZ.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarRentalMoveZ.Repository.Implementations
{
    public class OfferRepository : IOfferRepository
    {
       private readonly AppDbContext _context;

       public OfferRepository(AppDbContext context)
       {
            _context = context;
       }

        // Implement CRUD operations for Offer entity here

        public void Add(Models.Offer offer)
        {
            _context.Offers.Add(offer);
            _context.SaveChanges();
        }

        public void Delete(Offer offer)
        {
            _context.Offers.Remove(offer);
            _context.SaveChanges();
        }

        public IEnumerable<Offer> GetAllOffers()
        {
            return _context.Offers.ToList();
        }

        public async Task<List<Offer>> GetActiveOffersAsync()
        {
            return await _context.Offers
                .Where(o =>o.StartDate <= DateTime.Now && o.EndDate >= DateTime.Now)
                .ToListAsync();
        }

        public void Update(Offer offer)
        {
            _context.Offers.Update(offer);
            _context.SaveChanges();
        }

        public Offer GetById(int id)
        {
            return _context.Offers.FirstOrDefault(o => o.OfferId == id);
        }
    }
}
