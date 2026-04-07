import fs from "fs"
import path from "path"

export default function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const { file } = req.query

	if (!file || typeof file !== "string") {
		return res.status(400).json({ warning: "File parameter is required" })
	}

	const normalizedFile = path.normalize(file)
	if (normalizedFile.includes("..") || path.isAbsolute(normalizedFile)) {
		return res.status(403).json({ warning: "Access denied" })
	}

	const dataDir = path.join(process.cwd(), "data")
	const filePath = path.join(dataDir, normalizedFile)

	const resolvedPath = path.resolve(filePath)
	if (!resolvedPath.startsWith(path.resolve(dataDir))) {
		return res.status(403).json({ warning: "Access denied" })
	}

	// Determine the MIME type of the file based on its extension
	let mimeType
	const extension = path.extname(file).toLowerCase()
	switch (extension) {
		case ".json":
			mimeType = "application/json"
			break
		case ".svg":
			mimeType = "image/svg+xml"
			break
		case ".png":
			mimeType = "image/png"
			break
		case ".jpg":
		case ".jpeg":
			mimeType = "image/jpeg"
			break
		case ".webp":
			mimeType = "image/webp"
			break
		case ".gif":
			mimeType = "image/gif"
			break
		default:
			mimeType = "application/octet-stream" // Fallback MIME type
	}

	try {
		// Read the file
		const data = fs.readFileSync(filePath)

		// Set the Content-Type header to the appropriate value for the file
		if (mimeType) {
			res.setHeader("Content-Type", mimeType)
		}
		// Send the file data in the response
		res.end(data)
	} catch (err) {
		res.status(200).json({ warning: "File not found: " + file })
		res.end() // Send the response
	}
}
