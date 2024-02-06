export interface SerializedRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    queries: Record<string, string[]>;
    headers: Record<string, string>;
    body?: string;
    secret?: Record<string, unknown>;
}

export class Request implements SerializedRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    queries: Record<string, string[]>;
    headers: Record<string, string>;
    body?: string;
    secret?: Record<string, unknown>;
    constructor(raw: SerializedRequest) {
        this.body = raw.body;
        this.queries = raw.queries;
        this.headers = raw.headers;
        this.method = raw.method;
        this.path = raw.path;
        this.secret = raw.secret;
    }
    async json(): Promise<any> {
        return JSON.parse(this.body!)
    }
}

type ResponseOption = {
    status?: number,
    headers?: Record<string, string>
}
export class Response {
    status: number;
    body?: string;
    headers: Record<string, string>;
    constructor(body: string, options?: ResponseOption) {
        this.status = options?.status ?? 200;
        this.body = body;
        this.headers = {
            'Content-Type': 'text/html; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            ...options?.headers
        }
    }
}

export type Metadata = {
    title: string,
    description: string,
    openGraph: {
        title: string,
        description: string,
        images: [string],
    },
    other: Record<string, string>,
}

export function renderOpenGraph(metadata: Metadata): string {
    const sortedMetadata = Object.entries(metadata.other)
        .sort((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta property="og:title" content="${metadata.title}" />
            <meta property="og:image" content="${metadata.openGraph.images[0]}" />
            <title>${metadata.title}</title>
            ${sortedMetadata.map(([k, v]) => `
            <meta property="${k}" content="${v}" />`).join('')}
        </head>
        <body>
            <div align="center">
                <p><a href="https://github.com/Phala-Network/framehub-template"><img src="https://i.imgur.com/WrGTAKp.jpeg" alt="Logo" width="80" height="80"></a></p>
                <p>Frame hosted on <a href="https://github.com/Phala-Network/framehub-template">FrameHub</a>, a fully decentralized Vercel for Frame.</p>
                <img src="https://i.imgur.com/DqcisLn.png" width="600">
            </div>
        </body>
    </html>`
}

export type RouteConfig = {
    GET?: (req: Request) => Promise<Response>,
    POST?: (req: Request) => Promise<Response>,
    PATCH?: (req: Request) => Promise<Response>,
    PUT?: (req: Request) => Promise<Response>,
}

export async function route(config: RouteConfig, request: string) {
    const reqObj: SerializedRequest = JSON.parse(request)
    let response: Response;
    const method = reqObj.method
    const req = new Request(reqObj)
    if (method == 'GET' && config.GET) {
        response = await config.GET(req);
    } else if (method == 'POST' && config.POST) {
        response = await config.POST(req);
    } else if (method == 'PATCH' && config.PATCH) {
        response = await config.PATCH(req);
    } else if (method == 'PUT' && config.PUT) {
        response = await config.PUT(req);
    } else {
        response = new Response('Not Found');
        response.status = 404
    }
    return JSON.stringify(response)
}

// Only works for ascii string
export function stringToHex(str: string): string {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return '0x' + hex;
}
