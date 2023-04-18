'use strict'

const { worker, SourceCorruptError } = require('@adobe/asset-compute-sdk')
const fs = require('fs').promises

exports.main = worker(async (source, rendition) => {
  console.log("Within the custom processing profile")
  // Example of how to throw a standard asset compute error
  // if e.g. the file is empty or broken.
  const stats = await fs.stat(source.path)
  if (stats.size === 0) {
    throw new SourceCorruptError('source file is empty')
  }

  console.log("About to execute the custom processing profile")  
  // Working with sources and renditions happens through local files,
  // downloading and uploading is handled by the asset-compute-sdk.
  // In this example, simply copy source 1:1 to rendition:
  await fs.copyFile(source.path, rendition.path)

  // Tip: custom worker parameters are available in rendition.instructions
  console.log("Completed the custom processing profile job")
})
