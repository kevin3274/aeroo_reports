//##############################################################################
//
// This file is part of Aeroo Reports software - for license refer LICENSE file  
//
//##############################################################################

odoo.define('report_aeroo.report', function(require){
'use strict';

var ActionManager= require('web.ActionManager');
var crash_manager = require('web.crash_manager');
var framework = require('web.framework');

ActionManager.include({
  _executeReportAction: function (action, options){
        var self = this;
        var c_action = _.clone(action);
        if (c_action.report_type !== 'aeroo') {
            return self._super(action, options);
        }
        
        framework.blockUI();
        var aeroo_url = 'report/aeroo/' + c_action.report_name;
        if(c_action.context.active_ids){
            aeroo_url += '/' + c_action.context.active_ids.join(',');
        }else{
            aeroo_url += '?options=' + encodeURIComponent(JSON.stringify(c_action.data));
            aeroo_url += '&context=' + encodeURIComponent(JSON.stringify(c_action.context));
        }
        return $.Deferred(function(deferred) {
          self.getSession().get_file({
            url: aeroo_url,
            data: {data: JSON.stringify([
                aeroo_url,
                c_action.report_type
            ])},
            complete: framework.unblockUI,
            success: function (){
                if(c_action && options && !c_action.dialog){
                    options.on_close();
                    deferred.resolve()
                }
            },
            error(){
                crash_manager.rpc_error.apply(crash_manager, arguments);
                deferred.reject();
            },
        });
      });
    }
});
});
