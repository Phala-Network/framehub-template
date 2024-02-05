import "@phala/sidevm-env";
import { FrameRequest, getFrameMetadata, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit'
import { Request, Response, renderOpenGraph, route } from './frameSupport'

const BASE_URL = 'https://frames.phatfn.xyz'

async function GET(req: Request): Promise<Response> {
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: `FrameHub Template\nClick Here!`,
            },
        ],
        image: `https://framehub.4everland.store/PhatFrame.png`,
        post_url: BASE_URL + req.path,
    });

    return new Response(renderOpenGraph({
        title: BASE_URL + req.path,
        description: 'FrameHub',
        openGraph: {
            title: BASE_URL + req.path,
            description: 'FrameHub',
            images: [`https://framehub.4everland.store/PhatFrame.png`],
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
    const apiKey = req.secret?.apiKey ?? 'NEYNAR_API';

    const body: FrameRequest = await req.json();

    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: `${apiKey}`});

    if (isValid) {
      accountAddress = message.interactor.verified_accounts[0];
    }
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: `Phat Hello to ${accountAddress}`,
            },
        ],
        image: 'https://framehub.4everland.store/FrameHub.png',
        post_url: BASE_URL + req.path,
    });

    return new Response(renderOpenGraph({
            title: BASE_URL + req.path,
            description: 'FrameHub',
            openGraph: {
                title: BASE_URL + req.path,
                description: 'FrameHub',
                images: [`https://framehub.4everland.store/FrameHub.png`],
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

export default async function main(request: string) {
    return await route({GET, POST}, request)
}
