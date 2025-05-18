import path from "node:path";
import esbuild from "esbuild";

export const jsConfig = (eleventyConfig) => {
	eleventyConfig.addTemplateFormats("js");

	eleventyConfig.addExtension("js", {
		outputFileExtension: "js",
		compile: async (content, inputPath) => {
			// Skip processing if not in the designated scripts directories
			if (!inputPath.startsWith("./src/assets/scripts/")) {
				return;
			}

			// Inline scripts processing
			if (inputPath.startsWith("./src/assets/scripts/bundle/")) {
				const filename = path.basename(inputPath);
				const outputFilename = filename;
				const outputPath = `./src/_includes/scripts/${outputFilename}`;

				await esbuild.build({
					target: "es2020",
					entryPoints: [inputPath],
					outfile: outputPath,
					bundle: true,
					minify: true,
				});
				return;
			}

			// Default handling for other scripts, excluding inline scripts
			return async () => {
				const output = await esbuild.build({
					target: "es2020",
					entryPoints: [inputPath],
					bundle: true,
					minify: true,
					write: false,
				});

				return output.outputFiles[0].text;
			};
		},
	});
};
