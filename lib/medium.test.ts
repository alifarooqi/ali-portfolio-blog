import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MediumPost } from "./medium";

// `lib/medium.ts` reads the curated list from a static JSON import and per-post
// files from disk at runtime. We mock both layers so the tests don't depend on
// what's actually on disk in CI.
//
// `vi.mock()` is hoisted above the import, so the `vi.mock` calls have to
// reference variables that don't exist yet at the top — that's why we read
// from `vi.hoisted` and only set the values inside `beforeEach`.

const { mockList, readFileMock } = vi.hoisted(() => ({
  mockList: { current: { posts: [] } as { posts: unknown[] } },
  readFileMock: { current: undefined as unknown },
}));

vi.mock("./medium-list.json", () => ({
  default: { get posts() { return mockList.current.posts; } },
}));

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: (...args: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (readFileMock.current as any)?.(...args),
    },
  };
});

beforeEach(() => {
  mockList.current = { posts: [] };
  readFileMock.current = undefined;
  vi.resetModules();
});

describe("getMediumPosts", () => {
  it("returns one MediumPost per item in the curated list, in stored order", async () => {
    mockList.current = {
      posts: [
        {
          slug: "a-1",
          hash: "h1",
          title: "Alpha",
          subtitle: "Alpha teaser",
          image: "https://cdn/a.png",
          date: "2024-01-02T00:00:00.000Z",
          link: "https://medium.com/@u/a-1",
        },
        {
          slug: "b-2",
          hash: "h2",
          title: "Bravo",
          subtitle: "Bravo teaser",
          image: "https://cdn/b.png",
          date: "2024-01-01T00:00:00.000Z",
          link: "https://medium.com/@u/b-2",
        },
      ],
    };

    const { getMediumPosts } = await import("./medium");
    const posts = await getMediumPosts();

    expect(posts).toEqual([
      {
        title: "Alpha",
        subtitle: "Alpha teaser",
        image: "https://cdn/a.png",
        date: "2024-01-02T00:00:00.000Z",
        link: "https://medium.com/@u/a-1",
        slug: "a-1",
      },
      {
        title: "Bravo",
        subtitle: "Bravo teaser",
        image: "https://cdn/b.png",
        date: "2024-01-01T00:00:00.000Z",
        link: "https://medium.com/@u/b-2",
        slug: "b-2",
      },
    ]);
  });

  it("returns [] when the list is empty", async () => {
    const { getMediumPosts } = await import("./medium");
    expect(await getMediumPosts()).toEqual([]);
  });

  it("returns [] when the list is malformed (no `posts` array)", async () => {
    // @ts-expect-error — deliberately malformed mock
    mockList.current = {};
    const { getMediumPosts } = await import("./medium");
    expect(await getMediumPosts()).toEqual([]);
  });

  it("uses '' for `subtitle` when the entry has none", async () => {
    mockList.current = {
      posts: [
        {
          slug: "a-1",
          hash: "h1",
          title: "Alpha",
          image: "https://cdn/a.png",
          date: "2024-01-02T00:00:00.000Z",
          link: "https://medium.com/@u/a-1",
        },
      ],
    };

    const { getMediumPosts } = await import("./medium");
    const [post] = await getMediumPosts();
    expect(post?.subtitle).toBe("");
  });
});

describe("getMediumPost", () => {
  it("returns the parsed per-post file when both list and file are present", async () => {
    mockList.current = {
      posts: [
        {
          slug: "a-1",
          hash: "h1",
          title: "Alpha",
          subtitle: "Alpha teaser",
          image: "https://cdn/a.png",
          date: "2024-01-02T00:00:00.000Z",
          link: "https://medium.com/@u/a-1",
        },
      ],
    };

    const filePayload: MediumPost = {
      title: "Alpha (full)",
      link: "https://medium.com/@u/a-1",
      slug: "a-1",
      isoDate: "2024-01-02T00:00:00.000Z",
      content: "<p>body</p>",
      subtitle: "long-form teaser",
      image: "https://cdn/a.png",
    };
    readFileMock.current = async (filePath: string) => {
      if (String(filePath).endsWith("a-1.json")) return JSON.stringify(filePayload);
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    };

    const { getMediumPost } = await import("./medium");
    const post = await getMediumPost("a-1");

    expect(post).toEqual(filePayload);
  });

  it("returns `undefined` when the slug is not in the list", async () => {
    // readFile would explode if it were called — proves we don't read the disk
    // when the list lookup fails.
    readFileMock.current = async () => {
      throw new Error("should not be called");
    };

    const { getMediumPost } = await import("./medium");
    expect(await getMediumPost("not-in-list")).toBeUndefined();
  });

  it("returns `undefined` when the per-post file is missing on disk", async () => {
    mockList.current = {
      posts: [
        {
          slug: "a-1",
          hash: "h1",
          title: "Alpha",
          link: "https://medium.com/@u/a-1",
        },
      ],
    };
    readFileMock.current = async () => {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    };

    const { getMediumPost } = await import("./medium");
    expect(await getMediumPost("a-1")).toBeUndefined();
  });
});
