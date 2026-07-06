/**
 * src/routes/pathRoutes.js
 * -----------------------------------------------------------------------------
 * path module demonstration routes.
 * Important functions:
 * - path.join()      -> safely joins path segments
 * - path.resolve()   -> creates an absolute path
 * - path.basename()  -> gets file name from a path
 * - path.dirname()   -> gets parent directory
 * - path.extname()   -> gets extension like .txt or .json
 * - path.normalize() -> cleans duplicated slashes and .. segments
 */

const express = require("express");
const path = require("path");
const { ROOT_DIR, DATA_DIR } = require("../config/paths");

const router = express.Router();

router.get("/inspect", (req, res) => {
  const filename = req.query.filename || "notes.txt";
  const unsafeExample = `${DATA_DIR}/${filename}`;
  const safeJoinedPath = path.join(DATA_DIR, filename);

  res.json({
    input: filename,
    theory: "Use path.join/path.resolve instead of manual string concatenation for cross-platform safety.",
    rootDir: ROOT_DIR,
    dataDir: DATA_DIR,
    unsafeStringConcatExample: unsafeExample,
    safeJoinedPath,
    resolvedPath: path.resolve(DATA_DIR, filename),
    basename: path.basename(safeJoinedPath),
    dirname: path.dirname(safeJoinedPath),
    extname: path.extname(safeJoinedPath),
    normalized: path.normalize(`${DATA_DIR}//folder/../${filename}`),
    separatorUsedByCurrentOS: path.sep
  });
});

module.exports = router;
