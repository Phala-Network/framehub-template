import { type FrameRequest } from '@coinbase/onchainkit'
import { getFrameMetadata } from '@coinbase/onchainkit/dist/lib/core/getFrameMetadata'
import { getFrameMessage } from '@coinbase/onchainkit/dist/lib/core/getFrameMessage'
import { Request, Response, renderOpenGraph, route } from './frameSupport'

const BASE_URL = 'https://frames.phatfn.xyz'

const pageImgs = [
    'https://i.imgur.com/belk1Ha.png',
    'https://i.imgur.com/cyxUNGm.png',
    'https://i.imgur.com/fFTUIER.png',
    'https://i.imgur.com/YDwCZWQ.png',
    'https://i.imgur.com/r7ptyLR.png',
    'https://i.imgur.com/yfkqIf6.png',
]

function renderPage(curPage: number, path: string): string {
    const postUrl = `${BASE_URL}${path}?page=${curPage}`
    const isFirstPage = (curPage == 0)
    const isLastPage = (curPage == pageImgs.length - 1)
    const frameMetadata = getFrameMetadata({
        buttons: [
            // (isFirstPage ? { label: 'Get Started', action: 'link' } : { label: '⬅️ Prev' }),
            // (isLastPage ? { label: 'Get Started', action: 'link' } : { label: 'Next ➡️' }),
            (isFirstPage ? { label: 'Get Started', action: 'post_redirect' } : { label: '⬅️ Prev' }),
            (isLastPage ? { label: 'Get Started', action: 'post_redirect' } : { label: 'Next ➡️' }),
        ],
        image: pageImgs[curPage],
        post_url: postUrl,
        refresh_period: null,
        input: null,
    });
    // if (isFirstPage) {
    //     frameMetadata['fc:frame:button:1:target'] = 'https://github.com/Phala-Network/framehub-template'
    // } else if (isLastPage) {
    //     frameMetadata['fc:frame:button:2:target'] = 'https://github.com/Phala-Network/framehub-template'
    // }

    return renderOpenGraph({
        title: postUrl,
        description: 'FrameHub',
        openGraph: {
            title: postUrl,
            description: 'FrameHub',
            images: [pageImgs[0]],
        },
        other: frameMetadata,
    })
}
async function GET(req: Request): Promise<Response> {
    return new Response(
        renderPage(0, req.path),
        { headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}

async function POST(req: Request): Promise<Response> {
    const body: FrameRequest = await req.json()
    const pageNum = parseInt(req.queries['page'][0])
    const buttonId = body.untrustedData.buttonIndex
    // "Get Started" redirect buttons
    if ((pageNum == 0 && buttonId == 1) || (pageNum == pageImgs.length - 1 && buttonId == 2)) {
        return new Response('', {
            status: 302,
            headers: {
                'Location': 'https://github.com/Phala-Network/framehub-template'
            },
        })
    }

    const delta = [0, -1, 1][buttonId]
    const curPage = pageNum + delta
    
    return new Response(
        renderPage(curPage, req.path),
        { headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}

export default async function main(request: string) {
    return await route({GET, POST}, request)
}
