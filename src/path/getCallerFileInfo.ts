import { autoEscapedRegExp } from '@vvi/utils';
import { isWindows } from './isWindows';

/**
 * # 获取调用文件信息，此方法存在一些限制，请谨慎使用
 *
 * @param fileName 通过调用文件信息，返回调用者的文件路径
 * @returns 调用文件的信息
 *     - name 文件名
 *     - line 行号
 *     - row  列数
 *     - originArr 调用栈信息
 */
export function getCallerFileInfo(fileName: string): {
  name: string;
  line: number;
  row: number;
  originArr: string[];
} {
  /** 结果行 */
  const regexp = autoEscapedRegExp(fileName);
  let errorInfo: Error;
  try {
    // 抛出异常好通过这里捕捉调用栈信息
    throw new Error();
  } catch (error: unknown) {
    errorInfo = error as Error;
  }
  const lines: string[] = (
    errorInfo.stack?.replace(/\\/gm, '/').split('\n') as string[]
  ).reverse();

  /** 查找结果 */
  const resultIndex: number = lines.findIndex(
    (currentEle: string, currentIndex: number, arr: string[]) => {
      // 满足的项的上一项有满足文件地址
      if (!regexp.test(currentEle) && regexp.test(arr[currentIndex + 1]))
        return true;

      /** 低概率情况，使用文件与调用文件在同一个文件 */
      if (regexp.test(currentEle) && currentIndex === 0) return true;

      return false;
    },
  );
  /** 如果没找到 */
  if (resultIndex == -1) return { name: '', line: 0, row: 0, originArr: lines };

  let result = lines[resultIndex];

  // 去除结果行中的 （） 外部分，仅关注文件地址
  if (/\(.*\)/.test(result)) {
    result = result.replace(/^.*\((.*)\).*/, '$1');
  }
  /**
   * 在 windows 环境去除 file：/// 前缀
   * *现在在 mac 中也是这种形式了*
   */
  if (/file:\/*/.test(result)) {
    result = result.replace(/^.*file:\/*(.*)/, '$1');
  }
  // 非 windows 桌面添加 /
  if (!isWindows && !result.startsWith('/')) {
    result = '/' + result;
  }
  const match = result.match(/(.*?):(\d+):(\d+)/) ?? [result, result, 0, 0];

  return {
    name: match[1],
    line: Number(match[2]),
    row: Number(match[3]),
    originArr: lines,
  };
}

/**
 * # 获取调用文件的文本信息
 *
 * 需要搭配使用 `initializeFile`
 *
 * @param fileName 请使用 __filename
 * @returns 调用者信息
 * @example
 *  ```ts
 *  const [__filename,__dirname]  = initializeFile;
 *  const dir = getCallerFilename(__dirname);
 * ```
 */
export function getCallerFilename(fileName: string) {
  return getCallerFileInfo(fileName).name;
}
