import { useState, useEffect } from "react"
import moment from "moment"
import getConfig from "next/config"
import {
	osName,
	osVersion,
	browserName,
	engineName,
	engineVersion,
	browserVersion
} from "react-device-detect"
import { useSettings } from "@/context/settings"

const useFetchData = () => {
	const { settings } = useSettings()
	const { publicRuntimeConfig } = getConfig()
	const version = publicRuntimeConfig?.version

	const [data, setData] = useState({
		version: version || "Unknown",
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
		setData({
			version: version || "Unknown",
			theme: settings.theme?.name || "Unknown",
			time: moment().format(settings.fetch?.timeFormat || "HH:mm"),
			date: moment().format(settings.fetch?.dateFormat || "YYYY-MM-DD"),
			osName: osName || "Unknown",
			osVersion: osVersion || "Unknown",
			browser: browserName || "Unknown",
			browserLower: (browserName || "unknown").toLowerCase(),
			browserVersion: browserVersion || "0",
			engineName: engineName || "Unknown",
			engineVersion: engineVersion || "0"
		})
	}, [settings, version])

	return [data]
}

export default useFetchData
