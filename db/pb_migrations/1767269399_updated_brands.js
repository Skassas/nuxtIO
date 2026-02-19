/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1236351354")

  // remove field
  collection.fields.removeById("text3814588639")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool3814588639",
    "name": "default",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1236351354")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3814588639",
    "max": 0,
    "min": 0,
    "name": "default",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("bool3814588639")

  return app.save(collection)
})
