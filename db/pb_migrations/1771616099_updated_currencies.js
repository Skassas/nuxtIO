/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3379852803")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool2990775171",
    "name": "currency_auto_update",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3379852803")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool2990775171",
    "name": "auto_update",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
