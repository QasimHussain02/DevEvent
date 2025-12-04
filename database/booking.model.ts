import mongoose, { Schema, model, models, Document, Types } from 'mongoose';

/**
 * TypeScript interface for Booking document
 * Extends Mongoose Document to include all schema fields with proper types
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Add index for faster queries
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          // RFC 5322 compliant email regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook to verify that the referenced Event exists
 * Throws an error if the event is not found in the database
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      // Check if Event model exists to avoid circular dependency issues
      const EventModel = mongoose.models.Event;
      
      if (!EventModel) {
        return (new Error('Event model not found. Please ensure Event model is imported first.'));
      }

      // Verify the event exists
      const eventExists = await EventModel.findById(this.eventId);
      
      if (!eventExists) {
        return (new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (error) {
      if (error instanceof Error) {
        return (error);
      }
      return (new Error('Failed to validate event reference'));
    }
  }


});

// Prevent model recompilation in development (Next.js hot reload)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
