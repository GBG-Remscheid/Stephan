import { ArgsOf, GuardFunction } from "@typeit/discord";

export function Prefix(text: string, replace: boolean = true) {
    const guard: GuardFunction<ArgsOf<"message">> = async ([message], _client, next) => {
        const startsWith = message.content.startsWith(text);
        if (replace) {
            message.content = message.content.replace(text, "");
        }
        if (startsWith) {
            await next();
        }
    };

    return guard;
}