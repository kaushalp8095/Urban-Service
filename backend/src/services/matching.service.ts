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
    const bookingDate = new Date(booking.slot_datetime);
    const bookingTime = booking.slot_datetime.toISOString().split('T')[1].substring(0, 5); // "HH:mm"

    // 1. Find potential partners in this category
    const potentialPartners = await prisma.partner.findMany({
      where: {
        category_ids: { has: serviceCategoryId },
        kyc_status: 'APPROVED',
      },
      orderBy: { rating: 'desc' }
    });

    let assignedPartner = null;

    // 2. Iterate through partners to find one with an available slot
    for (const partner of potentialPartners) {
      const slot = await prisma.partnerSlot.findFirst({
        where: {
          partner_id: partner.id,
          date: {
            gte: new Date(bookingDate.setHours(0,0,0,0)),
            lt: new Date(bookingDate.setHours(23,59,59,999))
          },
          start_time: bookingTime,
          is_blocked: false
        }
      });

      if (slot) {
        // Also check if they have any OTHER overlapping booking at this time
        const overlappingBooking = await prisma.booking.findFirst({
          where: {
            partner_id: partner.id,
            slot_datetime: booking.slot_datetime,
            status: { in: [BookingStatus.ASSIGNED, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] }
          }
        });

        if (!overlappingBooking) {
          assignedPartner = partner;
          break;
        }
      }
    }

    if (assignedPartner) {
      // Assign the partner and update status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          partner_id: assignedPartner.id,
          status: BookingStatus.ASSIGNED
        }
      });
      
      // Block the slot (optional policy - usually one partner can do one job at a time)
      // await prisma.partnerSlot.updateMany({
      //   where: { partner_id: assignedPartner.id, date: bookingDate, start_time: bookingTime },
      //   data: { is_blocked: true }
      // });

      console.log(`[Matching Engine] Booking ${bookingId} assigned to Partner ${assignedPartner.id}`);
    } else {
      console.log(`[Matching Engine] No available partner found for Booking ${bookingId}`);
    }

  } catch (error) {
    console.error(`[Matching Engine] Error:`, error);
  }
};
