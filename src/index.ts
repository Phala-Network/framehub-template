import "@phala/pink-env";
// import { hexToString } from 'viem';
import { FrameRequest, getFrameMetadata, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit'
import { Request, Response, renderOpenGraph, route } from './frameSupport'

async function GET(req: Request): Promise<Response> {
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: 'Click Me',
            },
        ],
        image: `https://frames.thirdweb.com/farcaster.png`,
        post_url: `https://playground.phatfn.xyz/run_js_from_ipfs/bafkreietpvqoppjmbwnwypbcmrf2wmutwvlpwoaf2gqimpasyhfn7hjecy`,
    });

    return new Response(renderOpenGraph({
        title: 'zizzamia.xyz',
        description: 'LFG',
        openGraph: {
            title: 'zizzamia.xyz',
            description: 'LFG',
            images: [`https://frames.thirdweb.com/farcaster.png`],
        },
        other: {
            ...frameMetadata,
        },
      }),
      { headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}

async function getResponse(req: Request): Promise<Response> {
    let accountAddress: string | undefined = '';
  
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  
    if (isValid) {
      accountAddress = message.interactor.verified_accounts[0];
    }
  
    return new Response(getFrameHtmlResponse({
        buttons: [
            {
                label: `🌲 ${accountAddress} 🌲`,
            },
        ],
        image: `https://frames.thirdweb.com/farcaster.png`,
        post_url: `https://playground.phatfn.xyz/run_js_from_ipfs/bafkreietpvqoppjmbwnwypbcmrf2wmutwvlpwoaf2gqimpasyhfn7hjecy`,
    }));
}

async function POST(req: any): Promise<Response> {
    return getResponse(req);
}

export default async function main(request: string, secrets: string) {
    return await route({GET, POST}, request)
}
