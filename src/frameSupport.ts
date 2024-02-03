export interface SerizliedRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    headers: Record<string, string>;
    body: string;
}

export class Request implements SerizliedRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    headers: Record<string, string>;
    body: string;
    constructor(raw: SerizliedRequest) {
        this.body = raw.body;
        this.headers = raw.headers;
        this.method = raw.method;
        this.path = raw.path;
    }
    async json(): Promise<any> {
        return JSON.parse(this.body)
    }
}

type ResponseOption = {
    headers?: Record<string, string>
}
export class Response {
    status: number;
    body?: string;
    headers: Record<string, string>;
    constructor(body: string, options?: ResponseOption) {
        this.status = 200;
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
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta property="og:title" content="Phat Frame" />
            <meta property="og:image" content="${metadata.openGraph.images[0]}" />
            <title>https://phat-frame-template.4everland.store/index.js</title>
                ${Object.entries(metadata.other).map(([k, v]) => `
            <meta property="${k}" content="${v}" />`).join('\n')}
        </head>
    </html>`
}

export type RouteConfig = {
    GET?: (req: Request) => Promise<Response>,
    POST?: (req: Request) => Promise<Response>,
    PATCH?: (req: Request) => Promise<Response>,
    PUT?: (req: Request) => Promise<Response>,
}

export async function route(config: RouteConfig, request: string) {
    const reqObj = <SerizliedRequest> JSON.parse(request)
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
        response.status = 400
    }
    return JSON.stringify(response)
}

export function stringToHex(str: string): string {
    var hex = "";
    for (var i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16);
    }
    return "0x" + hex;
}
