import fs from "fs"
import path from "path"

export default function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	try {
		const filePath = path.join(process.cwd(), "data", "settings.json")
		const fileContents = fs.readFileSync(filePath, "utf8")
		res.status(200).json(JSON.parse(fileContents))
	} catch (error) {
		res.status(500).json({ error: "Failed to load settings" })
	}
}
