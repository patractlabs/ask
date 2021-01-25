/**
 * All Rights Reserved by Patract Labs.
 * @author liangqin.fan@gmail.com
 */

import { UInt32 } from "as-scale-codec";
import { FnParameters } from "../../../assembly/buildins/FnParameters";
import { Msg } from "../../../assembly/buildins/Msg";
import { ReturnData } from "../../../assembly/primitives/returndata";

 var msg = new Msg();
// @contract
class ExtLib {
  constructor() { }

  // @deployer
  onDeploy(): void {
  }

  // @message
  addFunc(factor1: u32, factor2: u32): u32 {
    return factor1 + factor2;
  }
}


export function deploy(): i32 {

  const ctorWithParams: u8[] = [0xd1, 0x83, 0x51, 0x2b]; // 0xd183512b
  const ctorWithoutParams: u8[] = [0x6a, 0x37, 0x12, 0xe2]; // 0x6a3712e2

  let callext = new ExtLib();

  if (msg.isSelector(ctorWithParams)) {
    callext.onDeploy();
  } else if (msg.isSelector(ctorWithoutParams)) {
    callext.onDeploy();
  } else {
    // nop
  }
  return 0;
}

export function call(): i32 {
  const flp = new ExtLib();
  const flipselector: u8[] = [0x38, 0xdf, 0x64, 0xef]; // "c096a5f3";

  // Step2: exec command
  if (msg.isSelector(flipselector)) { // flip operation
    let fnParameters = new FnParameters(msg.data);
    let f1 = fnParameters.get<UInt32>().unwrap();
    let f2 = fnParameters.get<UInt32>().unwrap();
    let r = flp.addFunc(f1, f2);

    ReturnData.set<UInt32>(new UInt32(r));
  }
  return 0;
}