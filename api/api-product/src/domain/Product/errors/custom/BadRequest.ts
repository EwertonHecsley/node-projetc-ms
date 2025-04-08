import { GenericErrors } from "../GenericError";

export class BadRequest extends GenericErrors {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}
