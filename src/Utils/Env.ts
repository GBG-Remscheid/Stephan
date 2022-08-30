import { config } from "dotenv";
import { singleton } from "tsyringe";
import Webuntis from "webuntis";

config();

@singleton()
export class Env {
    untis: Webuntis;
    exaroton;

    constructor() {
        this.untis = new Webuntis(
            process.env.SCHOOL ?? "",
            process.env.USERNAME ?? "",
            process.env.PASSWORD ?? "",
            process.env.BASEURL ?? ""
        );

        this.exaroton = process.env.EXAROTON_API_TOKEN ?? "";
    }
}
