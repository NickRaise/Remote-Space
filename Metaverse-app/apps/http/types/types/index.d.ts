import z from "zod";
export declare const SignUpSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodEnum<["admin", "user"]>;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    type: "admin" | "user";
}, {
    username: string;
    password: string;
    type: "admin" | "user";
}>;
export declare const SignInSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const UpdateMetadataSchema: z.ZodObject<{
    avatarId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    avatarId: string;
}, {
    avatarId: string;
}>;
export declare const CreateSpaceSchema: z.ZodObject<{
    name: z.ZodString;
    dimensions: z.ZodString;
    mapId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    dimensions: string;
    mapId: string;
}, {
    name: string;
    dimensions: string;
    mapId: string;
}>;
export declare const AddElementSchema: z.ZodObject<{
    elementId: z.ZodString;
    spaceId: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    elementId: string;
    spaceId: string;
    x: number;
    y: number;
}, {
    elementId: string;
    spaceId: string;
    x: number;
    y: number;
}>;
export declare const CreateElementSchema: z.ZodObject<{
    imageUrl: z.ZodString;
    width: z.ZodNumber;
    height: z.ZodNumber;
    static: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    imageUrl: string;
    width: number;
    height: number;
    static: boolean;
}, {
    imageUrl: string;
    width: number;
    height: number;
    static: boolean;
}>;
export declare const UpdateElementSchema: z.ZodObject<{
    imageUrk: z.ZodString;
}, "strip", z.ZodTypeAny, {
    imageUrk: string;
}, {
    imageUrk: string;
}>;
export declare const CreateAvatarSchema: z.ZodObject<{
    imageUrl: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    imageUrl: string;
}, {
    name: string;
    imageUrl: string;
}>;
export declare const CreateMapSchema: z.ZodObject<{
    thumbnail: z.ZodString;
    dimensions: z.ZodString;
    name: z.ZodString;
    defaultElements: z.ZodArray<z.ZodObject<{
        elementId: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        elementId: string;
        x: number;
        y: number;
    }, {
        elementId: string;
        x: number;
        y: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    dimensions: string;
    thumbnail: string;
    defaultElements: {
        elementId: string;
        x: number;
        y: number;
    }[];
}, {
    name: string;
    dimensions: string;
    thumbnail: string;
    defaultElements: {
        elementId: string;
        x: number;
        y: number;
    }[];
}>;
//# sourceMappingURL=index.d.ts.map