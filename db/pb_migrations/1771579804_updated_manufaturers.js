/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3206250501")

  // update collection data
  unmarshal({
    "name": "manufacturers"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3206250501")

  // update collection data
  unmarshal({
    "name": "manufaturers"
  }, collection)

  return app.save(collection)
})
