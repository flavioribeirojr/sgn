export default async function teardown() {
  if (globalThis.databaseContainer) {
    await globalThis.databaseContainer.stop()
  }
}