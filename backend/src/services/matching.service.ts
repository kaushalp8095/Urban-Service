import prisma from '../utils/db';
import { BookingStatus } from '@prisma/client';

/**
 * Matching Engine Scaffold
 * 
 * In a real application, this would:
 * 1. Find the booking's geo-coordinates.
 * 2. Query partners within an X km radius using PostGIS or similar.
 * 3. Filter partners by category_ids matching the service.
 * 4. Filter out partners who are already booked at this time slot.
 * 5. Sort by rating and completion rate.
 * 6. Send a notification to the top partner to accept/reject.
 */
export const findBestPartner = async (bookingId: string) => {
  console.log(`[Matching Engine] Triggered for booking ${bookingId}`);
  
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { package: { include: { service: true } } }
    });

    if (!booking) return;

    // SCENARIO: Mocking the assignment of the first available partner in the category
    // This is heavily simplified for scaffolding.
    const serviceCategoryId = booking.package.service.category_id;

    // Find any partner with this category_id
    const availablePartner = await prisma.partner.findFirst({
      where: {
        category_ids: { has: serviceCategoryId },
        kyc_status: 'APPROVED',
      },
      orderBy: { rating: 'desc' }
    });

    if (availablePartner) {
      // Assign the partner and update status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          partner_id: availablePartner.id,
          status: BookingStatus.ASSIGNED
        }
      });
      console.log(`[Matching Engine] Booking ${bookingId} assigned to Partner ${availablePartner.id}`);
      
      // TODO: Emit socket event or send Push Notification to Partner
    } else {
      console.log(`[Matching Engine] No available partner found for Booking ${bookingId}`);
      // Could queue for retry here.
    }

  } catch (error) {
    console.error(`[Matching Engine] Error:`, error);
  }
};
