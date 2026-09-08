/**
 * @packageDocumentation
 * @module @vvi/node/index
 * @file index.ts
 * @description _
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-09-08 15:07
 * @version 5.0.2
 * @lastModified 2026-09-08 15:21
 */

import { dev } from '@vvi/dev';
import { getCallerFileInfo } from '../src/index';

dev('测试调用信息栈', () => {
  const url = import.meta.url;

  const result = getCallerFileInfo(url);

  console.log(url, result);
});
