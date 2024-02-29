<br />
<div align="center">
  <a href="https://github.com/Phala-Network/framehub-template">
    <img src="https://i.imgur.com/WrGTAKp.jpeg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">FrameHub-Template</h3>

  <p align="center">
    Host Farcaster Frames on decentralized serverless cloud.
    <br />
    <a href="https://github.com/Phala-Network/framehub-template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://warpcast.com/hashwarlock/0x28888657">View Demo</a>
    ·
    <a href="https://github.com/Phala-Network/framehub-template/issues">Report Bug</a>
    ·
    <a href="https://t.me/framehubhq">Telegram Discussion</a>
  </p>
</div>

## About The Project

![](https://i.imgur.com/DqcisLn.png)

FrameHub is a decentralized Farcaster Frame hosting protocol. Unlike Vercel or other FaaS, it allows you to publish your Frame to IPFS and hosts it on a fully decentralized FaaS cloud with the following benefits:

- 💨 Ship Fast: Build and ship with familiar toolchain in minutes
- ⛑️ Secure: Execution guarded by rock solid TEE / Intel SGX
- 🔒 Private: Host API keys and user privacy at ease
- 💎 Unstoppable: Powered by IPFS and [Phala](https://phala.network)'s 35k+ decentralized TEE workers

## Getting Started

### Prepare

```bash
npm install
```

### Test Locally

```bash
npx ts-node src/test.ts
```

### Compile

Build your frame and output at `dist/index.js`.

```bash
npm run build
# yarn build
```

### Publish to IPFS

Build your frame and upload to IPFS

```bash
npm run publish
# yarn publish
```

Upon a successful upload, the command should show the URL to access your frame.
> Frame deployed at: https://frames.phatfn.xyz/ipfs/Qma4ejJPfuB9ag63TrWWd379QA1rKf1HyXJmLE5k16dAYk

<details>
<summary>New to thirdweb?</summary>
We use <a href="https://thirdweb.com/dashboard/infrastructure/storage">thirdweb Storage</a> to host IPFS contents. If you are new to thirdweb, the command will guide you to create your account or login to your existing account from the browser. (You may need to forward port 8976 if you are accessing a remote console via SSH.)
</details>

### Access the Published Frame

Once published, your frame is availabe at the URL: `https://frames.phatfn.xyz/ipfs/<your-cid>`. You can get it from the "Publish to IPFS" step.

You can test it with `curl`.

```bash
curl https://frames.phatfn.xyz/ipfs/<your-cid>
```

You can test the frame with the [Warpcast frame simulator](https://warpcast.com/~/developers/frames) with the URL.

## Advanced Usage

### Add Secrets

By default, all of the compiled JS code is visible for anyone to view if they look at IPFS CID. This makes private info like API keys, signer keys, etc. vulnerable to be stolen. To protect devs from leaking keys, we have added a field called `secret` in the `Request` object. It allows you to store secrets in a vault for your Frame to access.

<details>
<summary><b>How to Add Secrets</b></summary>

The steps to add a `secret` is simple. We will add the [Neynar](https://neynar.com) API Key in this example by creating a secret JSON object with the `apiKey`:

```json
{"apiKey": "<NEYNAR_API_KEY>"}
```

Then in your frame code, you will be able to access the secret key via `req.secret` object:

```js
async function POST(req: Request): Promise<Response> {
    const apiKey = req.secret?.apiKey
}
```

> Note: Before continuing, make sure to publish your compiled JS code, so you can add secrets to the CID.

**Open terminal**
Use `curl` to `POST` your secrets to `https://frames.phatfn.xyz/vaults`. Replace `IPFS_CID` with the CID to the compile JS code in IPFS, and replace `<NEYNAR_API_KEY>` with your Neynar API key.

The command will look like this:
```shell
curl https://frames.phatfn.xyz/vaults -H 'Content-Type: application/json' -d '{"cid": "IPFS_CID", "data": {"apiKey": "<NEYNAR_API_KEY>"}}'
# Output:
# {"token":"e85ae53d2ba4ca8d","key":"e781ef31210e0362","succeed":true}
```

The API returns a `token` and a `key`. The `key` is the id of your secret. It can be used to specify which secret you are going to pass to your frame. The `token` can be used by the developer to access the raw secret. You should never leak the `token`.

To verify the secret, run the following command where `key` and `token` are replaced with the values from adding your `secret` to the vault.
```shell
curl https://frames.phatfn.xyz/vaults/<key>/<token>
```

Expected output:
```shell
{"data":{"apiKey":"<NEYNAR_API_KEY>"},"succeed":true}
```

To see where the code is used in this template, check out [index.ts](./src/index.ts) line 36.

If you are using secrets, make sure that your Cast URL is set in the following syntax where `cid` is the IPFS CID of your compiled JS file and `key` is the `key` from adding secrets to your vault.
```text
https://frames.phatfn.xyz/ipfs/<cid>?key=<key>
```

https://github.com/Phala-Network/phat-frame-template/assets/64296537/620ad981-73a8-46c0-8cfd-16d2e245abfc

</details>

(TBD: instantiate, ...)

## Roadmap

- [x] Publish to IPFS command
- [x] Support secrets
- [ ] Free "Publish to IPFS" command
- [ ] SVG generation
- [ ] Database

## FAQ

<details>
<summary><b>What packages can I use in the frame server?</b></summary>
<ul>
  <li>Most of the npm packages are supported: viem, onchainkit, ….</li>
  <li>Some packages with some advanced features are not supported:</li>
  <ul>
    <li>Large code size. Compiled bundle should be less than 500kb.</li>
    <li>Large memory usage, like image generation</li>
    <li>Web Assembly</li>
    <li>Browser only features: local storage, service workers, etc</li>
  </ul>
</ul>
</details>

<details>
<summary><b>What’s the spec of the Javascript runtime?</b></summary>
<ul>
  <li>The code runs inside a tailored <a href="https://bellard.org/quickjs/">QuickJS engine</a></li>
  <li>Available features: ES2023, async, fetch, setTimeout, setInterval, bigint</li>
  <li>Resource limits</li>
  <ul>
    <li>Max execution time 10s</li>
    <li>Max memory usage: 16 mb</li>
    <li>Max code size: 500 kb</li>
    <li>Limited CPU burst: CPU time between async calls is limited. e.g. Too complex for-loop may hit the burst limit.</li>
  </ul>
</ul>
</details>

<details>
<summary><b>Why is the serverless platform secure?</b></summary>
<ul>
  <li>Your code on FrameHub is fully secure, private, and permissionless. Nobody can manipulate your program, steal any data from it, or censor it.</li>
  <li>Security: The code is executed in the decentralized TEE network running on Phala Network. It runs code inside a secure blackbox (called enclave) created by the CPU. It generates cryptographic proofs verifiable on Phala blockchain. It proves that the hosted code is exactly the one you deployed.</li>
  <li>Privacy: You can safely put secrets like API keys or user privacy on FrameHub. The code runs inside TEE hardware blackboxs. The memory of the program is fully encrypted by the TEE. It blocks any unauthorized access to your data.</li>
  <li>Learn more at <a href="https://phala.network">Phala Network Homepage</a></li>
</details>

<details>
<summary><b>What's TEE / Intel SGX?</b></summary>
<ul>
  <li><a href="https://collective.flashbots.net/t/tee-sgx-wiki/2019">TEE/SGX wiki</a></li>
  <li><a href="https://collective.flashbots.net/t/debunking-tee-fud-a-brief-defense-of-the-use-of-tees-in-crypto/2931">Debunking TEE FUD: A Brief Defense of The Use of TEEs in Crypto</a></li>
</details>
