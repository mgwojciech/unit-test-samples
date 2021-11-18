export function useStorage(storageKey: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            let methodRelatedKey = storageKey;
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
                methodRelatedKey = methodRelatedKey.replace(`{${_i}}`, args[_i]);
            }
            return new Promise((resolve, reject) => {
                try {
                    let storedValue = localStorage.getItem(methodRelatedKey);
                    if (storedValue) {
                        resolve(JSON.parse(storedValue));
                    }
                    originalMethod.apply(this, args).then((result: any) => {
                        localStorage.setItem(methodRelatedKey, JSON.stringify(result));
                        resolve(result);
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}