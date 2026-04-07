import { useState, useEffect } from "react"
import moment from "moment"
import { UAParser } from "ua-parser-js"
import { useSettings } from "@/context/settings"

const version = process.env.NEXT_PUBLIC_APP_VERSION || "Unknown"

const useFetchData = () => {
	const { settings } = useSettings()

	const [data, setData] = useState({
		version: version,
		theme: "Unknown",
		time: "Unknown",
		date: "Unknown",
		osName: "Unknown",
		osVersion: "Unknown",
		browser: "Unknown",
		browserLower: "unknown",
		browserVersion: "0",
		engineName: "Unknown",
		engineVersion: "0"
	})

	useEffect(() => {
		if (!settings) return

		const parser = new UAParser()
		const result = parser.getResult()

		setData({
			version: version,
			theme: settings.theme?.name || "Unknown",
			time: moment().format(settings.fetch?.timeFormat || "HH:mm"),
			date: moment().format(settings.fetch?.dateFormat || "YYYY-MM-DD"),
			osName: result.os?.name || "Unknown",
			osVersion: result.os?.version || "Unknown",
			browser: result.browser?.name || "Unknown",
			browserLower: (result.browser?.name || "unknown").toLowerCase(),
			browserVersion: result.browser?.version || "0",
			engineName: result.engine?.name || "Unknown",
			engineVersion: result.engine?.version || "0"
		})
	}, [settings])

	return [data]
}

export default useFetchData
