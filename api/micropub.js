import { micropub } from '../config.js'
export async function fetch(request) {
    return micropub.micropubHandler(request);
}