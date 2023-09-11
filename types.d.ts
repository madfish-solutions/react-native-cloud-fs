/** Defaults to `visible` */
export type Scope = 'visible' | 'hidden';

export interface CloudFileDetailsBase {
  name: string;
  /** ISO */
  lastModified: string;
}

export interface GoogleDriveFileDetails extends CloudFileDetailsBase {
  id: string;
}

export interface ICloudFileDetails extends CloudFileDetailsBase {
  isFile: boolean;
  isDirectory: boolean;
  path: string;
  size?: number;
  uri?: string;
}

export interface ICloudDocumentDetails {
  fileStatus: {
    downloading: string,
    isDownloading: boolean,
    isUploading: boolean,
    percentDownloaded: number,
    percentUploaded: number,
  }
}

export interface TargetPathAndScope {
  scope: Scope;
  targetPath: string;
}

export default defaultExport;

declare const defaultExport: Readonly<{
  /** iOS only */
  isAvailable: () => Promise<boolean>;

  /** Android only */
  loginIfNeeded: () => Promise<boolean>;

  /** Android only */
  requestSignIn: () => void;

  /**
   * (i) Only initiates syncing.
   * Files won't necessarily be immediately ready to use
   *
   * (!) Attempts to load all the iCloud Drive files
   */
  startIcloudSync: () => Promise<void>;

  /** Android only */
  logout: () => Promise<boolean>;

  /** Android only
   * (!) Broken - does nothing
   *
   * (!) Don't await - won't return.
   */
  reset: () => Promise<boolean>;

  // getConstants:

  /**
   * (!) Won't return for Android, if not signed-in via `loginIfNeeded`
   *
   * (!) Accounts only for locally present files for iOS
   */
  listFiles: <P extends Platform = 'iOS'>(options: TargetPathAndScope) => Promise<
    P extends 'iOS'
      ? {
        files: ICloudFileDetails[];
        /** Relative hosting dir path */
        path: string;
      }
      : {
        files?: GoogleDriveFileDetails[];
      }
  >;

  /**
   * @returns fileId: string // id for Android & path for iOS
   */
  copyToCloud: (
    options: TargetPathAndScope & {
      mimeType: string;
      sourcePath: { path: string } | { uri: string };
    }
  ) => Promise<string>;

  /**
   * (!) Accounts only for locally present files for iOS
   */
  fileExists: (
    options:
      | TargetPathAndScope // iOS
      | {
          // Android
          scope: Scope;
          fileId: string;
        }
  ) => Promise<boolean>;

  // deleteFromCloud: (fileId: string) => Promise<unknown>;

  getIcloudDocumentDetails: (options: TargetPathAndScope) => Promise<ICloudDocumentDetails | undefined>;

  getIcloudDocument: (options: TargetPathAndScope) => Promise<string | undefined>;

  getGoogleDriveDocument: (fileId: string) => Promise<string>;

  ////// # Key-Value-Store

  getKeyValueStoreObject: (key: string) => Promise<string | undefined>;

  getKeyValueStoreObjectDetails: (key: string) => Promise<{
    valueLength: number;
  } | undefined>;

  /**
   * (i) Single value size limit is 4KB; Total limit is 64KB
  */
  putKeyValueStoreObject: (data: { key: string; value: string }) => Promise<void>;

  /**
   * Syncs in-memory and disk key-value storages.
   * Later will be orkestrated for upload to iCloud.
   *
   * See:
   * - https://developer.apple.com/documentation/foundation/icloud/synchronizing_app_preferences_with_icloud
   * - https://developer.apple.com/documentation/foundation/nsubiquitouskeyvaluestore/1415989-synchronize
  */
  syncKeyValueStoreData: () => Promise<boolean>;

  removeKeyValueStoreObject: (key: string) => Promise<void>;
}>;

type Platform = 'Android' | 'iOS';
