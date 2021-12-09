export function useStorage(storageKey: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            let methodRelatedKey = replaceKeyTokens(storageKey, args);
            return new Promise((resolve, reject) => {
                try {
                    let storedValue = localStorage.getItem(methodRelatedKey);
                    if (storedValue) {
                        resolve(JSON.parse(storedValue));
                    }
                    originalMethod.apply(this, args).then((result: any) => {
                        localStorage.setItem(methodRelatedKey, JSON.stringify(result));
                        resolve(result);
                    }).catch(reject);
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
function replaceKeyTokens(storageKey: string, args: any[]) {
    let methodRelatedKey = storageKey;
    for (let i = 0; i < args.length; i++) {
        methodRelatedKey = methodRelatedKey.replace(`{${i}}`, args[i]);
    }
    return methodRelatedKey;
}
export function queueRequest(methodKey: string) {
    let queue: Promise<any>[] = [];
    let activePromises: Map<string, Promise<any>> = new Map();
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            let methodRelatedKey = replaceKeyTokens(methodKey, args);
            return new Promise((resolve, reject) => {
                let activePromise = activePromises.get(methodRelatedKey);
                if (!activePromise) {
                    activePromise = originalMethod.apply(this, args).then((result: any) => {
                        resolve(result); 
                        if (queue.length === 0) {
                            activePromises.delete(methodRelatedKey);
                        }
                        return result;
                    }).catch((err: any) => {
                        reject(err);
                        if (queue.length === 0) {
                            activePromises.delete(methodRelatedKey);
                        }
                    });
                    activePromises.set(methodRelatedKey, activePromise);
                }
                else {
                    let queuedPromise = new Promise((resolveSub, rejectSub) => {
                        activePromise.then((result: any) => {
                            resolve(result);
                            resolveSub(result);
                            queue.splice(queue.indexOf(queuedPromise), 1);
                            if (queue.length === 0) {
                                activePromises.delete(methodRelatedKey);
                            }
                        }).catch((err: any) => {
                            reject(err);
                            rejectSub(err);
                        });
                    });
                    queue.push(queuedPromise);
                }

            });
        }
    }
}