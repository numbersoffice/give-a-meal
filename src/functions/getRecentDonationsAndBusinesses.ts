import timeSince from "@/utils/getTimeSince"

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
        console.log(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/public/recent`)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/public/recent`, { next: { revalidate: 60 } })
        const { donations, businesses } = await res.json()

        const combinedData: RecentData[] = [...donations, ...businesses]
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 6)
            .map((data: any) => {
                if ("place_id" in data) {
                    return {
                        action: "newBusiness",
                        businessName: data.business_name ? data.business_name.charAt(0).toUpperCase() + data.business_name.slice(1) : "",
                        time: timeSince(data.created_at, dictionary),
                        donorName: "",
                        item: "",
                        id: data.id + "_business"
                    }
                } else {
                    return {
                        action: "newDonation",
                        businessName: data.business_id.business_name ? data.business_id.business_name.charAt(0).toUpperCase() + data.business_id.business_name.slice(1) : "",
                        time: timeSince(data.created_at, dictionary),
                        donorName: data.donor_name ? data.donor_name.charAt(0).toUpperCase() + data.donor_name.slice(1) : "",
                        item: data.item_id.title ? data.item_id.title.charAt(0).toUpperCase() + data.item_id.title.slice(1) : "",
                        id: data.id + "_donation"
                    }

                }
            })

        return combinedData

    } catch (err) {
        console.log(err)
        return []
    }
}

type RecentData = {
    action: "newDonation" | "newBusiness",
    businessName: string,
    time: string,
    donorName: string,
    item: string
    id: string
}