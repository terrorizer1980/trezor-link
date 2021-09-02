
const messageToJSONOld = require('../src/lowlevel/protobuf/message_decoder').messageToJSON
const messageToJSONNew = require('../src/lowlevel/protobuf/message_decoder-new').messageToJSON

const patch = require('../src/lowlevel/protobuf/monkey_patch').patch;

import * as ProtoBufOld from "protobufjs-old-fixed-webpack";
import * as ProtoBufNew from "protobufjs";

patch();

const messagesOld = {
    messages: [
        {
            "name": "String",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "string",
                    "name": "field",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "Uint32",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "uint32",
                    "name": "field",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
        {
            "name": "Uint64",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "uint64",
                    "name": "field",
                    "id": 3
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        },
    ]

}

const messagesNew = {
    "nested": {
        "hw": {
            "nested": {
                "trezor": {
                    "nested": {
                        "messages": {
                            "nested": {
                                "String": {
                                    "fields": {
                                        "field": {
                                            "rule": "required",
                                            "type": "string",
                                            "id": 1
                                        }
                                    }
                                },
                                "Uint32": {
                                    "fields": {
                                        "field": {
                                            "rule": "required",
                                            "type": "uint32",
                                            "id": 2
                                        }
                                    }
                                },
                                "Uint64": {
                                    "fields": {
                                        "field": {
                                            "rule": "required",
                                            "type": "uint64",
                                            "id": 3
                                        }
                                    }
                                },
                            }
                        }
                    }
                }
            }
        }
    }
}

const fixtures = [{
    name: 'String',
    params: { field: 'foo' },
    encoded: '0a03666f6f',
},
{
    name: 'Uint32',
    params: { field: 4294967295 },
    encoded: '10ffffffff0f',
},
{
    name: 'Uint64',
    params: { field: 1844674407370955 },
    encoded: '18cba19cd68bb7a303',
}
]

/**
 * These functions digest and wrap (and document) low level internal encoded / decode logic
 * 
 * This is only an intermediary step during the transition to the new library.
 */

const encodeOld = () => {

}

const decodeOld = () => {

}

const encodeNew = () => {

}

const decodeNew = () => {

}

describe('primitives encode/decode using old/new lib', () => {
    const MessagesOld = ProtoBufOld.newBuilder({})[`import`](messagesOld).build();
    const MessagesNew = ProtoBufNew.Root.fromJSON(messagesNew);


    fixtures.forEach(f => {
        describe(f.name, () => {
            const MessageOld = MessagesOld[f.name];
            const MessageNew = MessagesNew.lookup(`hw.trezor.messages.${f.name}`);

            test('serialize old way', async () => {
                // serialize old way - this is to confirm fixtures match old behavior
                const messageOld = new MessageOld(f.params);
                const encodedOld = messageOld.encodeAB();
                expect(Buffer.from(encodedOld).toString('hex')).toEqual(f.encoded);

                const decodedOld = messageToJSONOld(MessageOld.decode(encodedOld));
                expect(decodedOld).toEqual(f.params);
            });

            test('serialize new way', () => {
                // serialize new way - this is to confirm new lib won't break old behavior
                const messageNew = MessageNew.fromObject(f.params);
                const encodedNew = MessageNew.encode(messageNew).finish();
                expect(encodedNew.toString('hex')).toEqual(f.encoded);

                // parse new way - this is to confirm new lib won't break old behavior
                const decodedNew = messageToJSONNew(MessageNew.decode(encodedNew));
                expect(decodedNew).toEqual(f.params);
            });

        })

    })

})