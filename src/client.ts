import { BodyInit, Headers, RequestInit } from "node-fetch";
import {
  type IGyazo,
  type UploadResponse,
  type UploadOptions,
  type ListOptions,
  type ListResponse,
  type GetImageResponse,
  type DeleteResponse,
  type ErrorResponse,
  StatusCode,
  ClientResponse,
} from "./client.interface";
import fetch from "node-fetch";
import FormData from "form-data";
import { otherAPIUrl, uploadAPIUrl } from "./constants";

/**
 * Gyazo API client
 *
 * @example
 * ```ts
 *   const gyazo = new Gyazo("your-access-token");
 *   await gyazo.getImage("image-id");
 *   await gyazo.listImage();
 *   await gyazo.upload(fs.readFileSync("image.png"));
 *   await gyazo.delete("image-id");
 * ```
 */
export default class Gyazo implements IGyazo {
  private readonly fetchOptions: RequestInit;

  constructor(readonly accessToken: string) {
    this.fetchOptions = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  async getImage(imageId: string): Promise<ClientResponse<GetImageResponse>> {
    const res = await fetch(`${otherAPIUrl}/images/${imageId}`, this.fetchOptions);

    if (!res.ok || res.status !== StatusCode.Success) {
      return {
        error: {
          statusCode: res.status,
          body: (await res.json()) as ErrorResponse["body"],
        },
        success: null,
      };
    }

    return {
      error: null,
      success: (await res.json()) as GetImageResponse,
    };
  }

  async listImage(options?: ListOptions): Promise<ClientResponse<ListResponse>> {
    let url = `${otherAPIUrl}/images`;

    if (options) {
      const params = new URLSearchParams(options as Record<string, string>);
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, this.fetchOptions);
    if (!res.ok || res.status !== StatusCode.Success) {
      return {
        error: {
          statusCode: res.status,
          body: (await res.json()) as ErrorResponse["body"],
        },
        success: null,
      };
    }

    return {
      error: null,
      success: (await res.json()) as ListResponse,
    };
  }

  async upload(imageBuffer: Buffer, options: UploadOptions): Promise<ClientResponse<UploadResponse>> {
    const formData = new FormData();
    const { filename, contentType, ...leftOptions } = options;
    formData.append("imagedata", imageBuffer, {
      filename: options.filename,
      contentType: options.contentType,
      knownLength: imageBuffer.length,
    });

    for (const key in Object.keys(leftOptions)) {
      formData.append(key, leftOptions[key as never]);
    }

    const res = await fetch(uploadAPIUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...formData.getHeaders(),
      },
      body: formData as unknown as BodyInit,
    });

    if (!res.ok || res.status !== StatusCode.Success) {
      return {
        error: {
          statusCode: res.status,
          body: (await res.json()) as ErrorResponse["body"],
        },
        success: null,
      };
    }

    return {
      error: null,
      success: (await res.json()) as UploadResponse,
    };
  }

  async delete(imageId: string): Promise<ClientResponse<DeleteResponse>> {
    const res = await fetch(`${otherAPIUrl}/images/${imageId}`, {
      ...this.fetchOptions,
      method: "DELETE",
    });
    if (!res.ok || res.status !== StatusCode.Success) {
      return {
        error: {
          statusCode: res.status,
          body: (await res.json()) as ErrorResponse["body"],
        },
        success: null,
      };
    }

    return {
      error: null,
      success: (await res.json()) as DeleteResponse,
    };
  }
}
