const { default: baseFunctions } = require("@changesets/changelog-github")

/*
 * This is just a small wrapper around the base changelog-github formatter that
 * removes "Thanks @Beeequeue!" as it would be on every changelog entry
 */
exports.default = {
  getDependencyReleaseLine: baseFunctions.getDependencyReleaseLine,
  getReleaseLine: async (...options) => {
    const line = await baseFunctions.getReleaseLine(...options)

    return line.replace(/Thanks \[@BeeeQueue.*?!/g, "")
  },
}
