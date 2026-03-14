export function serializeBigInt(data: unknown) {
    return JSON.parse(
        JSON.stringify(data, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export function returnNumberedID(idS: string | string[]) {
    return Number(Array.isArray(idS) ? idS[0] : idS);
}