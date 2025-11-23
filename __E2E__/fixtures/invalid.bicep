// This file contains syntax errors for testing diagnostics

param location string = 'eastus'

// Missing required property 'location'
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'invalidstorage'
  // location is missing - should cause an error
  sku: {
    name: 'InvalidSku'  // Invalid SKU name
  }
  kind: 'StorageV2'
}

// Undefined variable reference
output accountId string = undefinedVariable.id
