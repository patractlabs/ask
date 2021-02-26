/**
 * All Rights Reserved by Patract Labs.
 * @author liangqin.fan@gmail.com
 */

import { ReturnCode } from "../primitives/alias";
import { ReadBuffer } from "../primitives/readbuffer";
import { seal_call } from "../seal/seal0";
import { UInt128, UInt64 } from "../deps/as-scale-codec/";
import { u128 } from "as-bignum";

export class Callable {
  private _callee: u8[] | null = null;
  private _gas: UInt64 | null = null;
  private _value: UInt128 | null = null;
  private _data: u8[] | null = null;
  private _outBuffer: ReadBuffer | null = null;

  constructor(callee: u8[]) {
    this._callee = callee;
  }

  gas(g: u64): Callable {
    this._gas = new UInt64(g);
    return this;
  }

  value(v: u128): Callable {
    this._value = new UInt128(v);
    return this;
  }

  data(d: u8[]): Callable {
    this._data = d;
    return this;
  }

  callResult(): u8[] {
    if (this._outBuffer === null) return [];
    return this._outBuffer!.valueBytes;
  }

  call(): ReturnCode {
    assert(this._callee !== null, "callee not set");
    assert(this._gas !== null, "gas not set");

    const callee = this._callee!;
    let value: u8[] | null = null;
    if (this._value === null) {
      value = [0];
    } else {
      value = this._value!.toU8a();
    }

    const data = this._data!;
    this._outBuffer = new ReadBuffer();
    const ret = seal_call(
      callee.buffer, callee.length,
      this._gas!.unwrap(),
      value.buffer, value.length,
      data.buffer, data.length,
      this._outBuffer!.valueBuffer, this._outBuffer!.sizeBuffer
    );

    return ret;
  }
}