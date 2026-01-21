import { currentUser } from "@clerk/nextjs/server";

export const permissionSeller = async (storeUrl: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized.");

  if (user.privateMetadata.role !== "SELLER")
    throw new Error("Unauthorized Access");

  if (!storeUrl) throw new Error("No shipping details provide to update.");
  return user.id;
};
