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

(TBD: secret, instantiate, ...)

## Under development

Current TODOs.

- [x] Publish to IPFS command
- [ ] Support secrets
- [ ] Free "Publish to IPFS" command
- [ ] SVG generation
- [ ] Database
