#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SwiftDataPlugin, "SwiftDataPlugin",
           CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(findAll, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(findById, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(save, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(delete, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(query, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(clearAllData, CAPPluginReturnPromise);
)
