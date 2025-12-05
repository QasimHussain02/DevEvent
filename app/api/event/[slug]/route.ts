import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

/**
 * Type definition for route parameters
 * Contains the dynamic slug parameter from the URL
 */
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Retrieves a single event by its unique slug
 * 
 * @param request - Next.js request object (unused but required by API route signature)
 * @param context - Contains route parameters including the slug
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    // Extract slug from route parameters
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Slug parameter is required and must be a valid string' 
        },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { 
          success: false,
          error: `Event with slug '${slug}' not found` 
        },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(
      { 
        success: true,
        data: event 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (consider using a proper logging service in production)
    console.error('Error fetching event by slug:', error);

    // Return generic error message to client
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred while fetching the event' 
      },
      { status: 500 }
    );
  }
}
