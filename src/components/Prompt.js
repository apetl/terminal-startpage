import { useSettings } from "@/context/settings"
import useFetchData from "@/hooks/useFetchData"

const Prompt = ({ command, showSymbol = true }) => {
	const { settings } = useSettings()
	const [browserData] = useFetchData()
	const lower_username = settings?.username?.toLowerCase() || "user"
	const promptSettings = settings?.prompt || {}

	return (
		<span className="flex cursor-default">
			<span className={`text-${promptSettings.userColor || "green"}`}>{lower_username}</span>
			<span className={`text-${promptSettings.atColor || "gray"}`}>@</span>
			<span className={`text-${promptSettings.hostColor || "magenta"}`}>
				{browserData.browserLower}
			</span>
			{showSymbol && (
				<span className={`text-${promptSettings.promptColor || "magenta"} ml-2`}>
					{" "}
					{promptSettings.promptSymbol || "$"}{" "}
				</span>
			)}
			{command && <span className="ml-2.5 text-textColor">{command}</span>}
		</span>
	)
}

export default Prompt
