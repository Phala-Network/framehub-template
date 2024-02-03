import "@phala/sidevm-env";
import { FrameRequest, getFrameMetadata, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit'
import { Request, Response, renderOpenGraph, route } from './frameSupport'

async function GET(req: Request): Promise<Response> {
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: 'Click Me!',
            },
        ],
        image: `https://phat-squid-frame.4everland.store/PhatFrame.png`,
        post_url: `https://playground.phatfn.xyz/run_js_from_ipfs/bafkreibt6sfmdpu7v4azq5xhriqsyj5utvbjpyo57snku7b7hwk6bx5vde`,
    });

    return new Response(renderOpenGraph({
        title: 'https://phat-frame-template.4everland.store/test/index.js',
        description: 'LFG',
        openGraph: {
            title: 'https://phat-frame-template.4everland.store/test/index.js',
            description: 'LFG',
            images: [`https://phat-squid-frame.4everland.store/PhatFrame.png`],
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

    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_API'});

    if (isValid) {
      accountAddress = message.interactor.verified_accounts[0];
    }
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: `Phat Hello to ${accountAddress}`,
            },
        ],
        image: 'https://phat-squid-frame.4everland.store/phat-frame-cropped.png',
        post_url: 'https://playground.phatfn.xyz/run_js_from_ipfs/bafkreibt6sfmdpu7v4azq5xhriqsyj5utvbjpyo57snku7b7hwk6bx5vde',
    });

    return new Response(renderOpenGraph({
            title: 'https://phat-frame-template.4everland.store/test/index.js',
            description: 'LFG',
            openGraph: {
                title: 'https://phat-frame-template.4everland.store/test/index.js',
                description: 'LFG',
                images: [`https://phat-squid-frame.4everland.store/phat-frame-cropped.png`],
            },
            other: {
                ...frameMetadata,
            },
        }),
        { headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}

async function POST(req: any): Promise<Response> {
    return getResponse(req);
}

export default async function main(request: string, secrets: string) {
    return await route({GET, POST}, request)
}
