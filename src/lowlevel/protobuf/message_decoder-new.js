/* @flow */

"use strict";


import * as ProtoBuf from "protobufjs";
import ByteBuffer from 'bytebuffer';
import Long from 'long';

/*
  Legacy outbound middleware
*/

export function messageToJSON(input) {
  // todo: this is the question;
  // const message = input.toJSON()
  const { $type, ...message } = input;
  const res = {};

  // console.log('$type', $type)
  for (const key in $type.fields) {
    const value = message[key];

    if (typeof value === `function`) {
      // ignoring
    } else if (value instanceof ByteBuffer) {
      const hex = value.toHex();
      res[key] = hex;
    } else if (value instanceof Long) {
      const num = value.toNumber();
      res[key] = num;
    }
    else {

      res[key] = value;
    }
  }
  return res;
}

