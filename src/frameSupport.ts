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

export class Response {
    status: number;
    body?: string;
    constructor(body: string) {
        this.status = 200;
        this.body = body;
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
    <!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${metadata.openGraph.images[0]}" />
        <meta property="og:image" content="${metadata.openGraph.images[0]}" />
        ${Object.entries(metadata.other).map((k, v) => `<meta property="${k}" content="${v}" />`)}
    </head></html>`
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
        response = { status: 400, body: "Not Found" }
    }
    return JSON.stringify(response)
}