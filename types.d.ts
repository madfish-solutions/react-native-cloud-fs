/** Defaults to `visible` */
export type Scope = 'visible' | 'hidden';

export interface CloudFileDetailsBase {
  name: string;
  /** ISO */
  lastModified: string;
}

export interface GoogleDriveFileDetails extends CloudFileDetailsBase {
  id: string;
};

export interface ICloudFileDetails extends CloudFileDetailsBase {
  isFile: boolean;
  isDirectory: boolean;
  path: string;
  size?: number;
  uri?: string;
}

export interface ICloudDocumentDetails {
  downloadingStatus: number;
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
}>;

type Platform = 'Android' | 'iOS';
