/**
 * @module @vvi/node/pathToFileURL
 * @file pathToFileURL.ts
 * @description 文件路径转换为统一的 `file://` 字符串
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-09-08 16:11
 * @version 5.0.2
 * @lastModified 2026-09-08 16:28
 */
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * # 将文件路径转化为系统文件地址
 * @param fileURL 文件路径
 * @returns 返回转换后的系统文件地址。在 POSIX 或 WINDOWS 系统中返回值可能不同
 * @example
 * ```ts
 * import { fileUrlToPath } from '@vvi/node';
 *
 * fileUrlToPath('file:///hello.ts'); // /hello.ts (POSIX)
 * fileUrlToPath('file:///hello.ts'); // \\hello.ts (WINDOWS)
 * ```
 */
export function fileUrlToPath(fileURL: string): string {
  return fileURLToPath(fileURL);
}

/**
 * # 将系统文件地址转化为文件路径
 * @param path 系统文件地址
 * @returns 返回转换后的文件路径
 * @example
 * ```ts
 * import { pathToFileUrl } from '@vvi/node';
 *
 * pathToFileUrl('\\hello.ts'); // 'file:///hello.ts' （WINDOWS）
 * pathToFileUrl('/hello.ts'); // 'file:///hello.ts' (POSIX)
 * ```
 */
export function pathToFileUrl(path: string): string {
  return pathToFileURL(path).toString();
}
