/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const units = app.findCollectionByNameOrId("pbc_586599074")
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\""
  }, units)
  app.save(units)

  const brands = app.findCollectionByNameOrId("pbc_1236351354")
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\""
  }, brands)
  app.save(brands)
}, (app) => {
  const units = app.findCollectionByNameOrId("pbc_586599074")
  unmarshal({
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }, units)
  app.save(units)

  const brands = app.findCollectionByNameOrId("pbc_1236351354")
  unmarshal({
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }, brands)
  app.save(brands)
})
