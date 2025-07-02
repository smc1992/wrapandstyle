import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// Define a type for the expected webhook payload for better type safety
interface RevalidateWebhookBody {
  post_type?: string;
  slug?: string;
  message?: string;
}

/**
 * WordPress webhook handler for on-demand content revalidation.
 *
 * This endpoint is triggered by the `next-wp-plugin` in WordPress when content is updated.
 * It intelligently revalidates the necessary paths in the Next.js application.
 *
 * Security:
 * - Expects a secret token via the 'x-webhook-secret' header.
 *
 * Payload:
 * - Expects a JSON body with 'post_type' and 'slug'.
 *
 * Revalidation Logic:
 * - Revalidates the home page ('/') on every trigger.
 * - Revalidates the specific path for the updated content (e.g., '/magazin/some-post-slug').
 * - Uses Next.js's `revalidatePath` for on-demand ISR.
 */
export async function POST(request: NextRequest) {
  // 1. Verify the secret token
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
    console.warn(`[Revalidate] Invalid webhook secret received.`);
    return NextResponse.json({ message: "Invalid webhook secret" }, { status: 401 });
  }

  // 2. Parse the request body
  let body: RevalidateWebhookBody;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[Revalidate] Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { post_type, slug, message } = body;
  console.log(
    `[Revalidate] Received webhook call. Post Type: ${post_type}, Slug: ${slug}, Message: ${message}`
  );

  // 3. Check for required fields
  if (!post_type) {
    console.warn("[Revalidate] Webhook payload missing 'post_type'.");
    return NextResponse.json(
      { message: "Webhook payload missing 'post_type'." },
      { status: 400 }
    );
  }

  try {
    // 4. Perform revalidation
    // Always revalidate the homepage to reflect recent posts/updates
    console.log("[Revalidate] Revalidating homepage: /");
    revalidatePath("/", "page");

    // Revalidate the specific path if a slug is provided
    if (slug) {
      let pathToRevalidate: string | undefined;

      // Determine the path based on the post type
      switch (post_type) {
        case "post":
          pathToRevalidate = `/magazin/${slug}`;
          break;
        case "page":
          // Assuming top-level pages. Adjust if you have nested pages.
          pathToRevalidate = `/${slug}`;
          break;
        case "team":
          // Team section is on the homepage, which is already revalidated.
          // If you create individual team member pages, add the path here.
          console.log(
            "[Revalidate] Team member updated. Homepage revalidation is sufficient."
          );
          break;
        default:
          console.log(
            `[Revalidate] No specific path to revalidate for post_type: ${post_type}`
          );
          break;
      }

      if (pathToRevalidate) {
        console.log(`[Revalidate] Revalidating path: ${pathToRevalidate}`);
        revalidatePath(pathToRevalidate, "page");
      }
    } else {
      console.log("[Revalidate] No slug provided, only revalidating homepage.");
    }

    console.log("[Revalidate] Revalidation process completed successfully.");
    return NextResponse.json({
      revalidated: true,
      message: `Revalidation successful for ${post_type} ${slug ? `(${slug})` : ""}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Revalidate] Failed to revalidate content:", errorMessage);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Failed to revalidate content.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

