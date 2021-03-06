import { FnParameters, msg, Storage, ReturnData, StoreMode, Bool, UInt128, u128, ScaleString, PackedStorableMap} from "ask-lang";
/**
 * All Rights Reserved by Patract Labs.
 * @author liangqin.fan@gmail.com
 */
import { StorableMap } from "ask-lang";

class MapTypes {
  _i8i8Map   : PackedStorableMap<UInt128, ScaleString> | null = null;

  get i8i8Map(): PackedStorableMap<UInt128, ScaleString> {
    if (this._i8i8Map === null) {
      this._i8i8Map = new PackedStorableMap<UInt128, ScaleString>("StorableMap.I8I8.0");
    }
    return this._i8i8Map!;
  }
}

@contract
class MapUsages {
  protected map: MapTypes;

  constructor() {
      this.map = new MapTypes();
  }

  @constructor
  default(k: u128, v: string): void {
    let key = new UInt128(k);
    this.map.i8i8Map.set(key, new ScaleString(v));
  }

  @message
  set(key: u128, value: string): void {
    this.map.i8i8Map.set(new UInt128(key), new ScaleString(value));
  }

  @message
  remove(key: u128): bool {
    return this.map.i8i8Map.delete(new UInt128(key));
  }

  @message(mutates = false)
  get(key: u128): string {
    Storage.mode = StoreMode.R;
    return this.map.i8i8Map.get(new UInt128(key)).toString();
  }
}

export function deploy(): i32 {
  let mspUsages = new MapUsages();

  const defaultSelector: u8[] = [0xed,0x4b,0x9d,0x1b];
  if (msg.isSelector(defaultSelector)) {
    const fnParameters = new FnParameters(msg.data);
    let p0 = fnParameters.get<UInt128>();
    let p1 = fnParameters.get<ScaleString>();
    mspUsages.default(p0.unwrap(), p1.toString());
  }
  return 0;
}

export function call(): i32 {
  const mapUsages = new MapUsages();
  const setSelector: u8[] = [0xe8,0xc4,0x5e,0xb6];
  if (msg.isSelector(setSelector)) {
    const fnParameters = new FnParameters(msg.data);
    let p0 = fnParameters.get<UInt128>();
    let p1 = fnParameters.get<ScaleString>();
    mapUsages.set(p0.unwrap(), p1.toString());
  }
  const getType128Selector: u8[] = [0x6a,0x01,0xaf,0x21];
  if (msg.isSelector(getType128Selector)) {
    const fnParameters = new FnParameters(msg.data);
    let p0 = fnParameters.get<UInt128>();
    let rs = mapUsages.get(p0.unwrap());
    ReturnData.set<ScaleString>(new ScaleString(rs));
  }

  const removeSelector: u8[] = [0x7a,0x01,0xaf,0x21];
  if (msg.isSelector(removeSelector)) {
    const fnParameters = new FnParameters(msg.data);
    let p0 = fnParameters.get<UInt128>();
    let rs = mapUsages.remove(p0.unwrap());
    ReturnData.set<Bool>(new Bool(rs));
  }

  return 0;
}