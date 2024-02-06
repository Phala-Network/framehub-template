import { type FrameRequest } from '@coinbase/onchainkit'
import { getFrameMetadata } from '@coinbase/onchainkit/dist/lib/core/getFrameMetadata'
import { getFrameMessage } from '@coinbase/onchainkit/dist/lib/core/getFrameMessage'
import { Request, Response, renderOpenGraph, route } from './frameSupport'

const BASE_URL = 'https://frames.phatfn.xyz'

const pageImgs = [
    'https://cloudflare-ipfs.com/ipfs/QmUUNNeYnnTdUxyeDqkMg67m1r6RsgpgbbeGR74nRZS1jX/1.png',
    'https://cloudflare-ipfs.com/ipfs/QmUUNNeYnnTdUxyeDqkMg67m1r6RsgpgbbeGR74nRZS1jX/2.png',
    'https://cloudflare-ipfs.com/ipfs/QmUUNNeYnnTdUxyeDqkMg67m1r6RsgpgbbeGR74nRZS1jX/3.png',
    'https://cloudflare-ipfs.com/ipfs/QmUUNNeYnnTdUxyeDqkMg67m1r6RsgpgbbeGR74nRZS1jX/4.png',
    'https://cloudflare-ipfs.com/ipfs/QmUUNNeYnnTdUxyeDqkMg67m1r6RsgpgbbeGR74nRZS1jX/5.png',
]

function renderPage(curPage: number, path: string): string {
    const postUrl = `${BASE_URL}${path}?page=${curPage}`
    const isFirstPage = (curPage == 0)
    const isLastPage = (curPage == pageImgs.length - 1)
    const frameMetadata = getFrameMetadata({
        buttons: [
            {label: isFirstPage ? 'Get Started' : '⬅️ Prev'},
            {label: isLastPage ? 'Get Started' : 'Next ➡️'}
        ],
        image: pageImgs[curPage],
        post_url: postUrl,
        refresh_period: null,
        input: null,
    });

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

/// Next frame: https://frames.phatfn.xyz/ipfs/QmReeqatcvgKYhvvJ38vDwgfKDsKbwKpuM2QktfF7qM3WM/0


async function POST(req: Request): Promise<Response> {
    const body: FrameRequest =  await req.json()
    const pageNum = parseInt(req.queries['page'][0])
    const delta = [-1, 1][body.untrustedData.buttonIndex]
    const curPage = pageNum + delta
    
    return new Response(
        renderPage(curPage, req.path),
        { headers: { 'Cache-Control': 'public, max-age=86400' } }
    );
}

export default async function main(request: string) {
    return await route({GET, POST}, request)
}
