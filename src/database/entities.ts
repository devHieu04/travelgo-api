import { Expense } from '../expenses/expense.entity.js';
import { ExpenseShare } from '../expenses/expense-share.entity.js';
import { Settlement } from '../expenses/settlement.entity.js';
import { ItineraryTemplate } from '../itinerary-templates/itinerary-template.entity.js';
import { ItineraryTemplateItem } from '../itinerary-templates/itinerary-template-item.entity.js';
import { Destination } from '../places/destination.entity.js';
import { HolidayPeriod } from '../places/holiday-period.entity.js';
import { Place } from '../places/place.entity.js';
import { PlaceOpeningHour } from '../places/place-opening-hour.entity.js';
import { ItineraryItem } from '../trips/itinerary-item.entity.js';
import { ItineraryItemComment } from '../trips/itinerary-item-comment.entity.js';
import { ItineraryItemVote } from '../trips/itinerary-item-vote.entity.js';
import { PackingItem } from '../trips/packing-item.entity.js';
import { TripInvite } from '../trips/trip-invite.entity.js';
import { TripMember } from '../trips/trip-member.entity.js';
import { Trip } from '../trips/trip.entity.js';
import { User } from '../users/user.entity.js';

/** Mọi entity của app; Nest và TypeORM CLI cùng dùng danh sách này. */
export const ENTITIES = [
  User,
  Destination,
  Place,
  PlaceOpeningHour,
  HolidayPeriod,
  ItineraryTemplate,
  ItineraryTemplateItem,
  Trip,
  TripMember,
  TripInvite,
  ItineraryItem,
  ItineraryItemVote,
  ItineraryItemComment,
  PackingItem,
  Expense,
  ExpenseShare,
  Settlement,
];
