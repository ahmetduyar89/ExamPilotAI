import Foundation
import Capacitor
import SwiftData

@available(iOS 17.0, *)
@Model
class SwiftDataRecord {
    @Attribute(.unique) var key: String
    var tableName: String
    var recordId: String
    var dataJson: String
    
    init(key: String, tableName: String, recordId: String, dataJson: String) {
        self.key = key
        self.tableName = tableName
        self.recordId = recordId
        self.dataJson = dataJson
    }
}

@available(iOS 17.0, *)
@objc(SwiftDataPlugin)
public class SwiftDataPlugin: CAPPlugin {
    
    private var container: ModelContainer?
    private var context: ModelContext?
    
    private func getContext() throws -> ModelContext {
        if let context = self.context {
            return context
        }
        let container = try ModelContainer(for: SwiftDataRecord.self)
        self.container = container
        let context = ModelContext(container)
        self.context = context
        return context
    }
    
    @objc func initialize(_ call: CAPPluginCall) {
        do {
            _ = try getContext()
            call.resolve()
        } catch {
            call.reject("Failed to initialize SwiftData model container: \(error.localizedDescription)")
        }
    }
    
    @objc func findAll(_ call: CAPPluginCall) {
        guard let tableName = call.getString("tableName") else {
            call.reject("tableName is required")
            return
        }
        
        do {
            let context = try getContext()
            let descriptor = FetchDescriptor<SwiftDataRecord>(
                predicate: #Predicate { $0.tableName == tableName }
            )
            let records = try context.fetch(descriptor)
            let items = records.map { $0.dataJson }
            call.resolve(["items": items])
        } catch {
            call.reject("Failed to fetch records: \(error.localizedDescription)")
        }
    }
    
    @objc func findById(_ call: CAPPluginCall) {
        guard let tableName = call.getString("tableName"),
              let id = call.getString("id") else {
            call.reject("tableName and id are required")
            return
        }
        
        let key = "\(tableName)_\(id)"
        do {
            let context = try getContext()
            let descriptor = FetchDescriptor<SwiftDataRecord>(
                predicate: #Predicate { $0.key == key }
            )
            let records = try context.fetch(descriptor)
            if let record = records.first {
                call.resolve(["item": record.dataJson])
            } else {
                call.resolve(["item": NSNull()])
            }
        } catch {
            call.reject("Failed to fetch record: \(error.localizedDescription)")
        }
    }
    
    @objc func save(_ call: CAPPluginCall) {
        guard let tableName = call.getString("tableName"),
              let id = call.getString("id"),
              let itemJson = call.getString("itemJson") else {
            call.reject("tableName, id, and itemJson are required")
            return
        }
        
        let key = "\(tableName)_\(id)"
        do {
            let context = try getContext()
            let descriptor = FetchDescriptor<SwiftDataRecord>(
                predicate: #Predicate { $0.key == key }
            )
            let records = try context.fetch(descriptor)
            if let existingRecord = records.first {
                existingRecord.dataJson = itemJson
            } else {
                let newRecord = SwiftDataRecord(key: key, tableName: tableName, recordId: id, dataJson: itemJson)
                context.insert(newRecord)
            }
            try context.save()
            call.resolve(["item": itemJson])
        } catch {
            call.reject("Failed to save record: \(error.localizedDescription)")
        }
    }
    
    @objc func delete(_ call: CAPPluginCall) {
        guard let tableName = call.getString("tableName"),
              let id = call.getString("id") else {
            call.reject("tableName and id are required")
            return
        }
        
        let key = "\(tableName)_\(id)"
        do {
            let context = try getContext()
            let descriptor = FetchDescriptor<SwiftDataRecord>(
                predicate: #Predicate { $0.key == key }
            )
            let records = try context.fetch(descriptor)
            if let record = records.first {
                context.delete(record)
                try context.save()
                call.resolve(["success": true])
            } else {
                call.resolve(["success": false])
            }
        } catch {
            call.reject("Failed to delete record: \(error.localizedDescription)")
        }
    }
    
    @objc func query(_ call: CAPPluginCall) {
        findAll(call)
    }
    
    @objc func clearAllData(_ call: CAPPluginCall) {
        do {
            let context = try getContext()
            try context.delete(model: SwiftDataRecord.self)
            try context.save()
            call.resolve()
        } catch {
            call.reject("Failed to clear data: \(error.localizedDescription)")
        }
    }
}
