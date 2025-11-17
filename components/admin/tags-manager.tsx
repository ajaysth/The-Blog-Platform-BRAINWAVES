import { TagsManagerClient } from "./tags-manager-client";
import { Tag } from "@prisma/client";

type TagWithCount = Tag & {
  _count: {
    posts: number;
  };
};

async function getTags() {
  // On the server, we need to use an absolute URL for fetch.
  // It's best practice to set this in your environment variables.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/tags?all=true`;

  try {
    const response = await fetch(url, {
      next: {
        tags: ["tags"],
      },
    });

    if (!response.ok) {
      // Log the error and return an empty array as a fallback.
      console.error("Failed to fetch tags:", await response.text());
      return [];
    }

    const data = await response.json();
    return data.tags as TagWithCount[];
  } catch (error) {
    console.error("An error occurred while fetching tags:", error);
    return [];
  }
}

export async function TagsManager() {
  const initialTags = await getTags();
  return <TagsManagerClient initialTags={initialTags} />;
}
