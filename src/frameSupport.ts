export type Request = {
    method: 'GET' | 'POST',
    json: () => Promise<any>,
}

export type SerizliedRequest = {
    method: 'GET' | 'POST',
    body: string,
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
