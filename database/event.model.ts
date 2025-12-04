import mongoose, { Schema, model, models, Document } from 'mongoose';

/**
 * TypeScript interface for Event document
 * Extends Mongoose Document to include all schema fields with proper types
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook for slug generation and date/time normalization
 * - Generates URL-friendly slug from title only when title changes
 * - Normalizes date to ISO format (YYYY-MM-DD)
 * - Ensures time is stored in HH:MM format
 */
EventSchema.pre('save', async function (next) {
  // Generate slug only if title is new or modified
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Ensure slug uniqueness by appending timestamp if duplicate exists
    const existingEvent = await mongoose.models.Event.findOne({ slug: this.slug });
    if (existingEvent && existingEvent._id.toString() !== this._id.toString()) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date')) {
    try {
      const parsedDate = new Date(this.date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      // Store as ISO date string (YYYY-MM-DD)
      this.date = parsedDate.toISOString().split('T')[0];
    } catch (error) {
      return (new Error('Date must be a valid date string'));
    }
  }

  // Normalize time to HH:MM format
  if (this.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(this.time)) {
      return (new Error('Time must be in HH:MM format (e.g., 14:30)'));
    }
  }

  // next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
