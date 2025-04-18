import { GenericErrors } from "../GenericError";

export class NotFound extends GenericErrors {
    constructor(message = 'Not Found') {
        super(message, 404)
    }
}