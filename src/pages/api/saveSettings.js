import fs from "fs"
import path from "path"

export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	if (!req.body || typeof req.body !== "object") {
		return res.status(400).json({ error: "Invalid request body" })
	}

	const filePath = path.join(process.cwd(), "data", "settings.json")
	try {
		fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))
		res.status(200).json({ message: "Settings saved" })
	} catch (error) {
		res.status(500).json({ error: "Failed to save settings" })
	}
}
