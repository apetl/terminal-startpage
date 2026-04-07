import { useEffect, useState } from "react"
import Head from "next/head"
import { useSettings } from "@/context/settings"
import { fetchAsset } from "@/utils/fetchAsset"

const Meta = () => {
	const [title, setTitle] = useState("Start Page")
	const [iconType, setIconType] = useState("na")
	const [icon, setIcon] = useState(null)
	const { settings } = useSettings()

	useEffect(() => {
		setTitle(settings.title ? settings.title : settings.username + " Start Page")

		if (!settings.fetch.image) return

		const iconExtension = settings.fetch.image.split(".").pop()
		switch (iconExtension) {
			case "svg":
				setIconType("image/svg+xml")
				break
			case "png":
				setIconType("image/png")
				break
			default:
				setIconType("na")
		}

		fetchAsset(settings.fetch.image)
			.then((data) => {
				if (data) {
					setIcon(data)
				}
			})
			.catch((error) => {
				console.error("Failed to fetch icon:", error)
			})
	}, [settings.fetch.image, settings.username, settings.title])

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={`Start page of ${settings.username}`} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			{icon && <link rel="icon" type={iconType} href={`${icon}`} />}
			<meta name="robots" content="noindex, nofollow"></meta>
		</Head>
	)
}

export default Meta
