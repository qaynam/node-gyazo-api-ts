import type { MockedFunction } from "vitest";
import Gyazo from "../src/client";
import fetch, { Response } from "node-fetch";
import { otherAPIUrl } from "../src/constants";
import { StatusCode } from "../src/client.interface";

vi.mock(import("node-fetch"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: vi.fn(() => {
      throw new Error("fetch is not implemented");
    }),
  };
});

const mockFetch = fetch as MockedFunction<typeof fetch>;

describe("Gyazo API Client", () => {
  const accessToken = "test-access-token";
  const gyazo = new Gyazo(accessToken);

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockReset();
  });

  it("should initialize", () => {
    const gyazo = new Gyazo(accessToken);
    expect(gyazo).toBeInstanceOf(Gyazo);
  });

  describe("getImage", () => {
    it("success", async () => {
      const imageId = "8980c52421e452ac3355ca3e5cfe7a0c";
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images/${imageId}`);
        expect(options.method).toBe("GET");
        options.headers.Authorization = `Bearer ${accessToken}`;
        return new Response(
          JSON.stringify({
            image_id: imageId,
            permalink_url: `https://gyazo.com/${imageId}`,
            thumb_url: `https://thumb.gyazo.com/thumb/${imageId}/l`,
            url: `https://i.gyazo.com/${imageId}.png`,
          }),
          {
            status: StatusCode.Success,
            statusText: "OK",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      });

      const { error, success } = await gyazo.getImage(imageId);
      expect(error).toBeNull();
      expect(success).not.toBeNull();
    });

    // it('error', async () => {
    //   const imageId = 'invalid-image-id';
    //   const image = await gyazo.getImage(imageId);
    // });
  });
});
