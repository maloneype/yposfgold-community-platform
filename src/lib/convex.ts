import { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
export { api }; 