import baseFunctions from "@changesets/changelog-github"

/*
 * This is just a small wrapper around the base changelog-github formatter that
 * removes "Thanks @Beeequeue!" as it would be on every changelog entry
 */
export default {
  getDependencyReleaseLine: baseFunctions.getDependencyReleaseLine,
  getReleaseLine: async (...options) => {
    const line = await baseFunctions.getReleaseLine(...options)

    return line.replace(/Thanks \[@BeeeQueue.*?!/g, "")
  },
}
