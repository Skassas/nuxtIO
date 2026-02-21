/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_164108563")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool2719391957",
    "name": "tax_default",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_164108563")

  // remove field
  collection.fields.removeById("bool2719391957")

  return app.save(collection)
})
