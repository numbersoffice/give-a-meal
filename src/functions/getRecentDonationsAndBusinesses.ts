import timeSince from "@/utils/getTimeSince";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Fetches recent donations and businesses from Payload
 * Combines donations and businesses into one array
 * Sorts by most recent
 * Transforms each object for use in RecentItem component
 * Limits to 6 results
 * @param dictionary
 */
export default async function getRecentDonationsAndBusinesses(dictionary: any) {
  try {
    const payload = await getPayload({ config });

    const [donationsRes, businessesRes] = await Promise.all([
      payload.find({
        collection: "donations",
        sort: "-createdAt",
        limit: 5,
        depth: 2,
        where: {
          "business.inactive": { not_equals: true },
        },
      }),
      payload.find({
        collection: "businesses",
        sort: "-createdAt",
        limit: 5,
        where: {
          inactive: { not_equals: true },
        },
      }),
    ]);

    const combinedData: RecentData[] = [
      ...donationsRes.docs,
      ...businessesRes.docs,
    ]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6)
      .map((data: any) => {
        if ("placeId" in data) {
          return {
            action: "newBusiness",
            businessName: data.businessName
              ? data.businessName.charAt(0).toUpperCase() +
                data.businessName.slice(1)
              : "",
            time: timeSince(data.createdAt, dictionary),
            donorName: "",
            item: "",
            id: data.id + "_business",
          };
        } else {
          const businessName = data.business?.businessName ?? "";
          const donorName = data.donatedBy?.firstName ?? data.donorName ?? "";
          const itemTitle = data.item?.title ?? "";
          return {
            action: "newDonation",
            businessName: businessName
              ? businessName.charAt(0).toUpperCase() + businessName.slice(1)
              : "",
            time: timeSince(data.createdAt, dictionary),
            donorName: donorName
              ? donorName.charAt(0).toUpperCase() + donorName.slice(1)
              : "",
            item: itemTitle
              ? itemTitle.charAt(0).toUpperCase() + itemTitle.slice(1)
              : "",
            id: data.id + "_donation",
          };
        }
      });

    return combinedData;
  } catch (err) {
    console.log(err);
    return [];
  }
}

type RecentData = {
  action: "newDonation" | "newBusiness";
  businessName: string;
  time: string;
  donorName: string;
  item: string;
  id: string;
};
