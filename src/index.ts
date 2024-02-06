import { type FrameRequest } from '@coinbase/onchainkit'
import { getFrameMetadata } from '@coinbase/onchainkit/dist/lib/core/getFrameMetadata'
import { getFrameMessage } from '@coinbase/onchainkit/dist/lib/core/getFrameMessage'
import { Request, Response, renderOpenGraph, route } from './frameSupport'

const BASE_URL = 'https://frames.phatfn.xyz'
const image = 'https://i.imgur.com/belk1Ha.png'

async function GET(req: Request): Promise<Response> {
    const secret = req.queries?.key ?? '';
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: 'FrameHub Template\nClick Here!',
            },
        ],
        image: image,
        post_url: BASE_URL + req.path + `?key=${secret[0]}`,
    });

    return new Response(renderOpenGraph({
        title: BASE_URL + req.path,
        description: 'FrameHub',
        openGraph: {
            title: BASE_URL + req.path,
            description: 'FrameHub',
            images: [image],
        },
        other: frameMetadata,
      }),
      { headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}

async function getResponse(req: Request): Promise<Response> {
    let accountAddress: string | undefined = '';
    const secret = req.queries?.key ?? ''
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
        image: image,
        post_url: BASE_URL + req.path + `?key=${secret[0]}`,
    });

    return new Response(renderOpenGraph({
            title: BASE_URL + req.path,
            description: 'FrameHub',
            openGraph: {
                title: BASE_URL + req.path,
                description: 'FrameHub',
                images: [image],
            },
            other: frameMetadata,
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
