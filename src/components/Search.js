import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { RunCommand, DefaultSearch } from "@/utils/command"
import Prompt from "@/components/Prompt"
import { useSettings } from "@/context/settings"

const Search = ({ commandChange, selectionChange }) => {
	const inputRef = useRef(null)
	const suggestionRef = useRef(null)

	const { settings, items } = useSettings()
	const [inputFocus, setInputFocus] = useState(false)

	const [command, setCommand] = useState("")
	const [selection, setSelection] = useState("")

	const filteredItems = useMemo(() => {
		if (command === "") return []
		return items.filter((item) => item.startsWith(command))
	}, [command, items])

	const suggestion = filteredItems.length > 0 ? filteredItems[0] : ""

	useEffect(() => {
		commandChange(command)
		if (command === "") {
			selectionChange("")
		}
	}, [command, commandChange, selectionChange])

	useEffect(() => {
		if (filteredItems.length <= 1) selectionChange("")
	}, [filteredItems, selectionChange])

	useEffect(() => {
		setTimeout(() => inputRef.current.focus(), 0)
	}, [inputFocus])

	const handleKeyDown = useCallback(
		(e) => {
			const isCtrlPressed = e.metaKey || e.ctrlKey
			if (e.key === "Enter") {
				const search_function = isCtrlPressed ? DefaultSearch : RunCommand
				search_function(command, settings)
			} else if (isCtrlPressed && e.code === "KeyC") {
				if (settings.prompt.ctrlC) {
					inputRef.current.value = ""
					selectionChange("")
					commandChange("")
				}
			} else if (e.key === "ArrowRight") {
				if (suggestion !== "") {
					e.preventDefault()
					inputRef.current.value = suggestion
					setCommand(suggestion)
					commandChange(suggestion)
					selectionChange("")
				}
			} else if (e.shiftKey && e.key === "Tab") {
				e.preventDefault()

				if (command === "" || filteredItems.length === 0) return

				let idx = -1
				if (selection && selection !== "")
					idx = filteredItems.indexOf(selection.toLowerCase())

				idx = (idx + filteredItems.length - 1) % filteredItems.length
				const selectedItem = filteredItems[idx]
				setSelection(selectedItem)
				selectionChange(selectedItem)
			} else if (e.key === "Tab") {
				e.preventDefault()

				if (command === "" || filteredItems.length === 0) return

				let idx = -1
				if (selection && selection !== "")
					idx = filteredItems.indexOf(selection.toLowerCase())

				idx = (idx + 1) % filteredItems.length
				const selectedItem = filteredItems[idx]
				setSelection(selectedItem)
				selectionChange(selectedItem)
			}
		},
		[command, suggestion, selection, filteredItems, settings, commandChange, selectionChange]
	)

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleKeyDown])

	return (
		<div id="search" className="flex">
			<Prompt />
			<div id="search-container" className="flex grow ml-2.5">
				<input
					className={`z-10 w-full bg-transparent text-textColor outline-none appearance-none shadow-none caret-${settings.prompt.caretColor}`}
					type="text"
					placeholder={settings.prompt.placeholder}
					ref={inputRef}
					autoFocus
					onChange={(e) => {
						setCommand(e.target.value.toLowerCase())
					}}
					onFocus={() => {
						setInputFocus(true)
					}}
					onBlur={() => {
						setInputFocus(false)
					}}
				/>
				<input
					className={`-z-10 opacity-50 w-full -ml-full bg-transparent text-textColor outline-none appearance-none shadow-none caret-${settings.prompt.caretColor}`}
					type="text"
					disabled
					placeholder={suggestion}
					ref={suggestionRef}
				/>
			</div>
		</div>
	)
}

export default Search
