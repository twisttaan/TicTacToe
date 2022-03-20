// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1_420_070_400_000;
let INCREMENT = BigInt(0);

/**
 * A container for useful snowflake-related methods.
 */
export class SnowflakeUtil extends null {
  /**
   * A {@link https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake},
   * except the epoch is 2015-01-01T00:00:00.000Z.
   *
   * If we have a snowflake '266241948824764416' we can represent it as binary:
   * ```
   * 64                                          22     17     12          0
   *  000000111011000111100001101001000101000000  00001  00000  000000000000
   *       number of ms since Discord epoch       worker  pid    increment
   * ```
   * @typedef {string} Snowflake
   */

  /**
   * Generates a Discord snowflake.
   * <info>This hardcodes the worker's id as 1 and the process's id as 0.</info>
   * @returns {Snowflake} The generated snowflake
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static generate() {
    const timestamp = Date.now();
    if (INCREMENT >= 4095n) INCREMENT = BigInt(0);

    // Assign WorkerId as 1 and ProcessId as 0:
    return (
      (BigInt(timestamp - EPOCH) << 22n) |
      (1n << 17n) |
      INCREMENT++
    ).toString();
  }
}
