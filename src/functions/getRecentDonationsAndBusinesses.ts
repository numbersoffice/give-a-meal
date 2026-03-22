import timeSince from "@/utils/getTimeSince";

/**
 * Fetches recent donations and businesses from API
 * Combines donations and businesses into one array
 * Sorts by most recent
 * Transforms each object for use in RecentItem component
 * Limits to 4 results
 * @param dictionary
 */
export default async function getRecentDonationsAndBusinesses(dictionary: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/custom/public/recent`,
      { next: { revalidate: 60 } },
    );
    const { donations, businesses } = await res.json();

    const combinedData: RecentData[] = [...donations, ...businesses]
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
