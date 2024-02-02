import main from './index'
import { stringToHex } from 'viem'

async function execute(inputObj: any) {
    const inputJson = JSON.stringify(inputObj)
    const input = stringToHex(inputJson);
    console.log('INPUT:', input)
    return await main(input, '')
}

const sampleInput = {
    "untrustedData": {
        "fid": 2,
        "url": "https://fcpolls.com/polls/1",
      "messageHash": "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
        "timestamp": 1706243218,
        "network": 1,
        "buttonIndex": 2,
        "castId": {
            fid: 226,
            hash: "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9",
        }
    },
    "trustedData": {
        "messageBytes": "d2b1ddc6c88e865a33cb1a565e0058d757042974...",
    }
}

async function test() {
    {
        const result = await execute({
            method: 'GET',
        })
        console.log('GET RESULT:', JSON.parse(result))
    }
    {
        const result = await execute({
            method: 'POST',
            body: JSON.stringify(sampleInput)
        })
        console.log('POST RESULT:', JSON.parse(result))
    }
}

test().then(() => {}).catch(err => console.error).finally(() => process.exit())