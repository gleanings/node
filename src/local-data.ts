/**
 * @module @vvi/node/local-data
 * @file local-data.ts
 * @description 本地数据
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-09-23 23:11
 * @version 5.0.5
 * @lastModified 2026-09-23 23:14
 */

import { mkdirSync, unlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { isUndefined } from '@vvi/is';
import { fileExist } from './file/index';
import { readFileToJsonSync } from './file/readFileToJson';
import { writeJsonFileSync } from './file/writeJsonFile';
import { pathJoin } from './path/pathJoin';
import { dog } from './utils/dog';

/** 
 * # 写入本地数据
 */
export class LocalData {
    
  #filename: string;

  #available: boolean = true;

  /**  值是否可用  */
  get available(): boolean {
    return this.#available;
  }

  /**
   *  构造函数
   *
   * @param fileName  文件名
   */
  constructor(fileName: string) {
    const homeDir = getVerifiedHomeDir();

    if (isUndefined(homeDir)) {
      this.#available = false;
      this.#filename = '';
      return;
    }
    this.#available = true;
    this.#filename = pathJoin(homeDir, '.mudbean.data', `${fileName}`);
  }

  /**
   * 获取某文件的
   *
   *
   * @param fileName 读取文件的地址
   * @returns 当读取受限或是读取失败返回 null；可读取却没有数据，返回是一个空对象
   */
  read<T extends Record<string, unknown> = Record<string, unknown>>(
    fileName: string,
  ): T | Record<string, never> | null {
    if (!this.available) {
      return null;
    }
    const _ = pathJoin(this.#filename, fileName);
    const __ = fileExist(_);

    if (isUndefined(__)) {
      return {};
    } else {
      return (readFileToJsonSync(_) as T) || {};
    }
  }
  /**
   * 写入文件
   *
   * 写入并不是总能如意，当写入受限（this.available 值为 false）或是写入不成功都将返回 false
   *
   * @param fileName  写入文件的名
   * @param content  要写入的内容
   * @returns 返回写入的状态，倘若不允许向用户目录下写入文件或是写入失败，都将返回 false
   */
  write(fileName: string, content: object) {
    if (!this.available) {
      return false;
    }

    const _ = pathJoin(this.#filename, fileName);
    const _dir = pathJoin(_, '../');
    dog('创建的文件路径为');
    mkdirSync(_dir, { recursive: true });
    dog('写入的文件路径为：', _);
    dog('写入文件内容为', content);
    const result = writeJsonFileSync(_, content);
    dog('写入反馈', result);
    return result;
  }
  /**  获取文件路径   */
  getPath(fileName: string) {
    return pathJoin(this.#filename, fileName);
  }
} 
/**
 *
 * 获取真实的跟路径
 *
 */
  function getVerifiedHomeDir() {
  /**  跟文件  */
  const home = homedir();

  dog('当前获取用户主目录为', home);

  if (!home || home === '/' || home.includes('Default')) {
    throw new Error('未能获取到主目录路径 <' + home + '>');
  }

  try {
    /**  测试文件  */
    const testFile = pathJoin(home, 'test_write' + Date.now());
    writeJsonFileSync(testFile, {});
    unlinkSync(testFile);
    return home;
  } catch (error) {
    dog.error(error);
    return undefined;
  }
}