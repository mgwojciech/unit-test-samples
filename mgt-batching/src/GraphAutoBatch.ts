import { IGraph, IBatch, IProvider, PACKAGE_VERSION, chainMiddleware } from "@microsoft/mgt-element";
import { SdkVersionMiddleware } from "@microsoft/mgt-element/dist/es6/utils/SdkVersionMiddleware";
import { Batch } from "@microsoft/mgt-element/dist/es6/utils/Batch";
import {
    AuthenticationHandler,
    Client,
    GraphRequest,
    HTTPMessageHandler,
    Middleware,
    MiddlewareOptions,
    RetryHandler,
    RetryHandlerOptions,
    TelemetryHandler,
    Context
} from '@microsoft/microsoft-graph-client';

export class GraphAutoBatch implements IGraph {
    /**
    * the internal client used to make graph calls
    *
    * @type {Client}
    * @memberof IGraph
    */
    readonly client: Client;
    /**
    * the component name appended to Graph request headers
    *
    * @type {string}
    * @memberof IGraph
    */
    readonly componentName: string = "";
    /**
    * the version of the graph to query
    *
    * @type {string}
    * @memberof IGraph
    */
    readonly version: string = "v1.0";
    private registeredPromises: Map<string, PromiseLike[]> = new Map<string, PromiseLike[]>();
    private currentBatch?: IBatch;
    constructor(protected provider: IProvider, public batchWaitTime: number = 200) {
        const middleware: Middleware[] = [
            new AuthenticationHandler(provider),
            new RetryHandler(new RetryHandlerOptions()),
            new TelemetryHandler(),
            new SdkVersionMiddleware(PACKAGE_VERSION, provider.name),
            new HTTPMessageHandler()
        ];

        this.client = Client.initWithMiddleware({
            middleware: chainMiddleware(...middleware)
        });
    }
    public api(path: string): GraphRequest {
        let request = this.client.api(path);
        const baseGet = request.get.bind(request);
        request.get = (callback) => {
            // if (path.indexOf("/photo/$value") > 0) {
            //     return baseGet(callback);
            // }
            return new Promise((resolve, reject) => {
                //@ts-ignore
                const url = path + request.createQueryString()
                this.createGetBatchRequest(url, { resolve, error: reject });
            });
        }
        const basePost = request.post.bind(request);
        request.post = (content, callback) => {
            if (path === "$batch") {

            }
            return basePost(content, callback)
        }
        return request;
    }
    public createBatch<T = any>(): IBatch<T> {
        return new Batch(this);
    }
    public forComponent(component: Element): IGraph {
        return this;
    }

    protected generateBatch = () => {
        this.currentBatch?.executeAll().then((responses) => {
            responses.forEach((response, key) => {
                let promiseId = key;
                if (this.registeredPromises.has(promiseId)) {
                    this.registeredPromises.get(promiseId)!.forEach((promise) => {
                        promise.resolve(response.content);
                    });
                    this.registeredPromises.delete(promiseId);
                }
            });
        });
        this.currentBatch = undefined;
    }
    public createGetBatchRequest = (url: string, requestPromise: PromiseLike) => {
        if (!this.currentBatch) {
            this.currentBatch = this.createBatch();
            setTimeout(this.generateBatch, this.batchWaitTime);
        }
        let promiseId = encodeURIComponent(url);
        let apiUrl = new URL(url, "https://graph.microsoft.com");
        let relativeUrl = apiUrl.pathname + apiUrl.search;
        if (this.registeredPromises.has(promiseId)) {
            this.registeredPromises.get(promiseId)!.push(requestPromise);
        }
        else {
            this.currentBatch.get(promiseId, url);
            this.registeredPromises.set(promiseId, [requestPromise]);
        }
    }
}

export interface PromiseLike {
    resolve: (data: any) => void;
    error: (error: any) => void;
}