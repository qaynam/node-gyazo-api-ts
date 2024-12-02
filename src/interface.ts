export interface UploadResponse {
  image_id: string;
  permalink_url: string;
  thumb_url: string;
  url: string;
  type: string;
}

export type ListResponse = Array<{
  image_id: string;
  permalink_url: string;
  thumb_url: string;
  url: string;
  type: "png" | "jpeg";
  created_at: string;
  metadata: {
    app: string | null;
    title: string | null;
    url: string | null;
    desc: string | null;
  };
  ocr: {
    locale: "en" | "ja";
    description: string;
  };
}>;

export interface GetImageResponse {
  image_id: string;
  permalink_url: string | null;
  thumb_url: string | null;
  type: "png" | "jpg";
  created_at: string;
  metadata: {
    app: string | null;
    title: string | null;
    url: string | null;
    desc: string | null;
  };
  ocr: {
    locale: "en" | "ja";
    description: string;
  };
}

export interface DeleteResponse {
  image_id: string;
  type: "png" | "jpg";
}

export interface UploadOptions {
  access_policy?: "anyone" | "only_me";
  meta_data_is_public?: boolean;
  referer_url: string;
  app: string;
  title: string;
  desc: string;
  created_at: string;
  collection_id: string;
}

export interface ListOptions {
  /**
   * page number
   *
   * @default 1
   */
  page?: number;
  /**
   * number of items per page
   *
   * @default 20
   */
  per_page?: number;
}

export interface IGyazo {
  readonly accessToken: string;
  /**
   * upload image
   *
   * 画像をアップロードするAPI。
   *
   * @see https://gyazo.com/api/docs/image#upload
   * @param image
   * @param options
   * @returns success: UploadResponse fail: unknown
   *
   * @example
   * example response
   *  ```json
   * {
   *    "image_id" : "8980c52421e452ac3355ca3e5cfe7a0c",
   *    "permalink_url": "http://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c",
   *    "thumb_url" : "https://i.gyazo.com/thumb/180/afaiefnaf.png",
   *    "url" : "https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png",
   *    "type": "png"
   * }
   * ```
   */
  upload(image: Buffer | BinaryData, options: UploadOptions): Promise<UploadResponse | unknown>;

  /**
   * list images
   *
   * ユーザーの画像一覧を取得するAPI。
   *
   * @see https://gyazo.com/api/docs/image#list
   * @param options
   * @returns success: { ListResponse }
   * @example
   * example response
   * ```json
   *  {
   *     "image_id": "8980c52421e452ac3355ca3e5cfe7a0c",
   *     "permalink_url": "http://gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c",
   *     "thumb_url": "https://i.gyazo.com/thumb/afaiefnaf.png",
   *     "url": "https://i.gyazo.com/8980c52421e452ac3355ca3e5cfe7a0c.png",
   *     "type": "png",
   *     "created_at": "2014-05-21 14:23:10+0900",
   *     "metadata": {
   *        "app": null,
   *        "title": null,
   *        "url": null,
   *        "desc": null
   *     },
   *     "ocr": {
   *        "locale": "en",
   *        "description": "Gyazo\n",
   *     }
   *  }
   */
  listImage(options: ListOptions): Promise<ListResponse | unknown>;

  /**
   * get single image by id
   *
   * 画像の情報を取得するAPI。
   *
   * @see https://gyazo.com/api/docs/image#get
   * @param imageId
   * @returns success: {GetImageResponse} fail: unknown
   * @example
   * example response
   * ```json
   * {
   *   "image_id": "27a9dca98bcf5cafc0bd84a80ee9c0a1",
   *   "permalink_url": null,
   *   "thumb_url": null,
   *   "type": "png",
   *   "created_at": "2018-07-24T07:33:24.771Z",
   *   "metadata": {
   *     "app": null,
   *     "title": null,
   *     "url": null,
   *     "desc": null
   *   },
   *   "ocr": {
   *     "locale": "en",
   *     "description": "Gyazo\n",
   *   }
   * }
   */
  getImage(imageId: string): Promise<GetImageResponse | unknown>;

  /**
   * delete image by id
   *
   * 画像を削除するAPI。
   *
   * @see https://gyazo.com/api/docs/image#delete
   * @param imageId
   * @returns success: {DeleteResponse} fail: unknown
   * @example
   * example response
   * ```json
   * {
   *    "image_id": "8980c52421e452ac3355ca3e5cfe7a0c",
   *    "type": "png"
   * }
   */
  delete(imageId: string): Promise<DeleteResponse | unknown>;
}
