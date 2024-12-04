/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MockedFunction } from "vitest";
import Gyazo from "../src/client";
import fetch, { Response } from "node-fetch";
import { otherAPIUrl, uploadAPIUrl } from "../src/constants";
import { StatusCode } from "../src/client.interface";
import FormData from "form-data";

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
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);

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
      expect.assertions(5);
    });

    it("error", async () => {
      const imageId = "8980c52421e452ac3355ca3e5cfe7a0c";
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images/${imageId}`);
        expect(options.method).toBe("GET");
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);
        return new Response(
          JSON.stringify({
            message: "Not Found",
          }),
          {
            status: StatusCode.NotFound,
            statusText: "Not Found",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      });

      const { error, success } = await gyazo.getImage(imageId);
      expect(error).not.toBeNull();
      expect(success).toBeNull();
      expect.assertions(5);
    });
  });

  describe("listImage", () => {
    it("( success ) without options", async () => {
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images`);
        expect(options.method).toBe("GET");
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);
        return new Response(
          JSON.stringify([
            {
              image_id: "8980c52421e452ac3355ca3e5cfe7a0c",
              permalink_url: `https://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c`,
              thumb_url: `https://thumb.gyazo.com/thumb/8980c52421e452ac3355ca3e5cfe7a0c/l`,
              url: `https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png`,
            },
          ]),
          {
            status: StatusCode.Success,
            statusText: "OK",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      });

      const { error, success } = await gyazo.listImage();
      expect(error).toBeNull();
      expect(success).not.toBeNull();
      expect(success?.length).toBe(1);
      expect(success?.at(0)?.image_id).toBe("8980c52421e452ac3355ca3e5cfe7a0c");
      expect(success?.at(0)?.permalink_url).toBe(`https://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c`);
      expect(success?.at(0)?.thumb_url).toBe(`https://thumb.gyazo.com/thumb/8980c52421e452ac3355ca3e5cfe7a0c/l`);
      expect(success?.at(0)?.url).toBe(`https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png`);
      expect.assertions(10);
    });

    it("( success ) with options", async () => {
      const mockedResult = [
        {
          image_id: "8980c52421e452ac3355ca3e5cfe7a0c",
          permalink_url: `https://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c`,
          thumb_url: `https://thumb.gyazo.com/thumb/8980c52421e452ac3355ca3e5cfe7a0c/l`,
          url: `https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png`,
        },
        {
          image_id: "7980c52421e452ac3355ca3e5cfe7a0c",
          permalink_url: `https://gyazo.com/7980c52421e452ac3355ca3e5cfe7a0c`,
          thumb_url: `https://thumb.gyazo.com/thumb/7980c52421e452ac3355ca3e5cfe7a0c/l`,
          url: `https://i.gyazo.com/7980c52421e452ac3355ca3e5cfe7a0c.png`,
        },
      ];
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images?page=2&per_page=2`);
        expect(options.method).toBe("GET");
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);
        return new Response(JSON.stringify(mockedResult), {
          status: StatusCode.Success,
          statusText: "OK",
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      const { success, error } = await gyazo.listImage({
        page: 2,
        per_page: 2,
      });
      expect(error).toBeNull();
      expect(success).not.toBeNull();
      expect(success?.length).toBe(2);
      expect(success).toStrictEqual(mockedResult);
      expect.assertions(7);
    });

    it("error", async () => {
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images`);
        expect(options.method).toBe("GET");
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);
        return new Response(
          JSON.stringify({
            message: "Unauthorized",
          }),
          {
            status: StatusCode.Unauthorized,
            statusText: "Unauthorized",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      });

      const { error, success } = await gyazo.listImage();
      expect(error).not.toBeNull();
      expect(success).toBeNull();
      expect.assertions(5);
    });
  });

  describe("uploadImage", () => {
    it("success", async () => {
      const image = Buffer.from("test-image");
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(uploadAPIUrl);
        expect(options.method).toBe("POST");
        expect(options.headers["Authorization"]).toBe(`Bearer ${accessToken}`);
        expect(options.headers["content-type"]).toStrictEqual(
          expect.stringContaining("multipart/form-data; boundary="),
        );
        expect(options.body instanceof FormData).toBeTruthy();
        expect((options.body as FormData).getBuffer() instanceof Buffer).toBeTruthy();

        options.body = image;
        return new Response(
          JSON.stringify({
            image_id: "8980c52421e452ac3355ca3e5cfe7a0c",
            permalink_url: `https://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c`,
            thumb_url: `https://thumb.gyazo.com/thumb/8980c52421e452ac3355ca3e5cfe7a0c/l`,
            url: `https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png`,
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

      const { error, success } = await gyazo.upload(image, {
        filename: "test.png",
        contentType: "image/png",
      });

      expect(error).toBeNull();
      expect(success).not.toBeNull();
      expect(success?.image_id).toBe("8980c52421e452ac3355ca3e5cfe7a0c");
      expect(success?.permalink_url).toBe(`https://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c`);
      expect(success?.thumb_url).toBe(`https://thumb.gyazo.com/thumb/8980c52421e452ac3355ca3e5cfe7a0c/l`);
      expect(success?.url).toBe(`https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png`);

      expect.assertions(12);
    });

    it("error", async () => {
      const image = Buffer.from("test-image");
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(uploadAPIUrl);
        expect(options.method).toBe("POST");
        expect(options.headers["Authorization"]).toBe(`Bearer ${accessToken}`);
        expect(options.headers["content-type"]).toStrictEqual(
          expect.stringContaining("multipart/form-data; boundary="),
        );
        expect(options.body instanceof FormData).toBeTruthy();
        expect(options.body.getBuffer() instanceof Buffer).toBeTruthy();

        return new Response(
          JSON.stringify({
            message: "Bad Request",
          }),
          {
            status: StatusCode.BadRequest,
            statusText: "Bad Request",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      });

      const { error, success } = await gyazo.upload(image, {
        filename: "test.png",
        contentType: "image/png",
      });
      expect(error).not.toBeNull();
      expect(success).toBeNull();
      expect.assertions(8);
    });
  });

  describe("delete", () => {
    it("success", async () => {
      const imageId = "8980c52421e452ac3355ca3e5cfe7a0c";
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images/${imageId}`);
        expect(options.method).toBe("DELETE");
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);

        return new Response(
          JSON.stringify({
            image_id: imageId,
            permalink_url: `https://gyazo.com/${imageId}`,
            thumb_url: `https://thumb.gyazo.com/thumb/${imageId}/l`,
            url: `https://i.gyazo.com/${imageId}.png`,
          }),
        );
      });

      const { error, success } = await gyazo.delete(imageId);
      expect(error).toBeNull();
      expect(success).not.toBeNull();
      expect(success?.image_id).toBe(imageId);
      expect.assertions(6);
    });

    it("error", async () => {
      const imageId = "8980c52421e452ac3355ca3e5cfe7a0c";
      mockFetch.mockImplementationOnce(async (url: any, options: any) => {
        expect(url).toBe(`${otherAPIUrl}/images/${imageId}`);
        expect(options.method).toBe("DELETE");
        expect(options.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);
        return new Response(
          JSON.stringify({
            message: "Not Found",
          }),
          {
            status: StatusCode.NotFound,
            statusText: "Not Found",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      });

      const { error, success } = await gyazo.delete(imageId);
      expect(error).not.toBeNull();
      expect(success).toBeNull();
      expect.assertions(5);
    });
  });
});
