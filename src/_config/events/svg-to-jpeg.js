import { existsSync, promises as fsPromises } from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";

const ogImagesDir = "./src/assets/og-images";

export const svgToJpeg = async () => {
	const socialPreviewImagesDir = "dist/assets/og-images/";

	if (!existsSync(socialPreviewImagesDir)) {
		console.log("⚠ No OG images dir found");
		return;
	}

	const files = await fsPromises.readdir(socialPreviewImagesDir);
	if (files.length > 0) {
		files.forEach(async (filename) => {
			const outputFilename = filename.substring(0, filename.length - 4);
			if (
				filename.endsWith(".svg") &
				!existsSync(path.join(ogImagesDir, outputFilename))
			) {
				const imageUrl = socialPreviewImagesDir + filename;
				await Image(imageUrl, {
					formats: ["jpeg"],
					outputDir: ogImagesDir,
					filenameFormat: (id, src, width, format, options) =>
						`${outputFilename}.${format}`,
				});
			}
		});
	} else {
		console.log("⚠ No images found on OG images dir");
	}
};
