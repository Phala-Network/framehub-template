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
        image: `https://phat-squid-frame.4everland.store/PhatFrame.png`,
        post_url: `https://phat-frame-template.4everland.store/index.js`,
    });

    return new Response(renderOpenGraph({
        title: 'https://phat-frame-template.4everland.store/index.js',
        description: 'LFG',
        openGraph: {
            title: 'https://phat-frame-template.4everland.store/index.js',
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
    // const { isValid, message } = await getFrameMessage(body, { neynarApiKey: '' });
    //
    // if (isValid) {
    //   accountAddress = message.interactor.verified_accounts[0];
    // }

    return new Response(getFrameHtmlResponse({
        buttons: [
            {
                label: `Phat Hello`,
            },
        ],
        image: `https://phat-squid-frame.4everland.store/phat-frame-cropped.png`,
        post_url: `https://phat-frame-template.4everland.store/index.js`,
    }));
}

async function POST(req: any): Promise<Response> {
    return getResponse(req);
}

export default async function main(request: string, secrets: string) {
    return await route({GET, POST}, request)
}
