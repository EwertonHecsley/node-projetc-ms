// src/domain/utils/assyncController.ts
import { Request, Response, NextFunction } from "express";

export function wrapController<T extends object>(controller: T): T {
    const wrapped = {} as T;

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(controller))) {
        const handler = controller[key as keyof T];

        if (typeof handler === 'function' && key !== 'constructor') {
            (wrapped as any)[key] = async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await (handler as Function).call(controller, req, res, next);
                } catch (error) {
                    next(error);
                }
            };
        }
    }

    return wrapped;
}
