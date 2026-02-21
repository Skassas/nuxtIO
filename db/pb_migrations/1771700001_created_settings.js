/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "settings001",
    "created": new Date().toISOString(),
    "updated": new Date().toISOString(),
    "name": "settings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "company_name",
        "name": "company_name",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "company_phone",
        "name": "company_phone",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "company_tax_place",
        "name": "company_tax_place",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "company_tax_number",
        "name": "company_tax_number",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "company_address",
        "name": "company_address",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "company_logo",
        "name": "company_logo",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSize": 5242880,
          "mimeTypes": ["image/*"],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "functional_currency",
        "name": "functional_currency",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "pbc_3379852803",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["currency_code"]
        }
      },
      {
        "system": false,
        "id": "reporting_currency",
        "name": "reporting_currency",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "pbc_3379852803",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["currency_code"]
        }
      },
      {
        "system": false,
        "id": "installed",
        "name": "installed",
        "type": "bool",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "install_date",
        "name": "install_date",
        "type": "autodate",
        "required": false,
        "unique": false,
        "options": {
          "onCreate": true,
          "onUpdate": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("settings001")
  return app.delete(collection)
})
