# FrameHub Template

A Farcaster Frame Server running on decentralized serverless cloud.

## Prepare

```bash
npm install
```

## Test Locally

```bash
npx ts-node src/test.ts
```

## Compile

```bash
npx @phala/fn build --experimentalAsync
```

## Publish to IPFS

```bash
npx thirdweb upload dist/index.js
```

Upon a successful upload, the command should show something like below. You can copy the IPFS CID (the string after "ipfs://") for the next step.
> ✔ Files stored at the following IPFS URI: ipfs://QmVNNQvmYY8VqaZwXKYsejkko2eF83yqxzaoaRoBHsbDcH

## Access the Published Frame

Once published, your frame is availabe at the URL: `https://frames.phatfn.xyz/ipfs/<your-cid>`. Replace `<your-cid>` with the CID of the published js file.

You can test it with `curl`.

```bash
curl https://frames.phatfn.xyz/ipfs/<your-cid>
```

You can test the frame with the [Warpcast frame simulator](https://warpcast.com/~/developers/frames) with the URL.

## Advanced Usage

### Add Secrets
By default, all of the compiled JS code is visible for anyone to view if they look at IPFS CID. This makes private info like API keys, signer keys, etc. vulnerable to be stolen. To enable secrets, we have created a field called `secret` in the `SerializedRequest` interface to pass in secrets.
The steps to add a `secret` is simple. We will add the [Neynar](https://neynar.com) API Key in this example by creating a key value `apiKey` mapped to a value.
> Note: Before continuing, make sure to publish your compiled JS code, so you can add secrets to the CID.

**Open terminal**
Use `curl` to `POST` your secrets to `https://frames.phatfn.xyz/vaults`. Replace `IPFS_CID` with the CID to the compile JS code in IPFS, and replace `NEYNAR_API_KEY` with your Neynar API key.

The command will look like this:
```shell
curl https://frames.phatfn.xyz/vaults -H 'Content-Type: application/json' -d '{"cid": "IPFS_CID", "data": {"apiKey": "NEYNAR_API_KEY"}}'
```

The output should return something similar:
```shell
{"token":"e85ae53d2ba4ca8d","key":"e781ef31210e0362","succeed":true}
```

To verify the secret, run the following command where `key` and `token` are replaced with the values from adding your `secret` to the vault.
```shell
curl https://frames.phatfn.xyz/vaults/<key>/<token>
```

Expected output:
```shell
{"data":{"apiKey":"NEYNAR_API_KEY"},"succeed":true}
```

To see where the code is used in this template, check out [index.ts](./src/index.ts) line 36.

If you are using secrets, make sure that your Cast URL is set in the following syntax where `cid` is the IPFS CID of your compiled JS file and `key` is the `key` from adding secrets to your vault.
```text
https://frames.phatfn.xyz/ipfs/<cid>/<key>
```

(TBD: instantiate, ...)

## Under development

Current TODOs.

- [x] Publish to IPFS command
- [x] Support secrets
- [ ] Free "Publish to IPFS" command
- [ ] SVG generation
- [ ] Database
