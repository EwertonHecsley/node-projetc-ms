import { GenericErrors } from "../GenericError";

export class NotFoundError extends GenericErrors {
    constructor() {
        super('Not Found', 404)
    }
}