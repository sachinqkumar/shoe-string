"use strict";
var mongoose = require('mongoose')
  , hm = require('./history-model');


module.exports = function historyPlugin(schema, options) {
  var customCollectionName = options && options.customCollectionName;

  // Clear all history collection from Schema
  schema.statics.historyModel = function () {
    return hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options);
  };

  // Clear all history documents from history collection
  schema.statics.clearHistory = function (callback) {
    var History = hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options);
    History.remove({}, function (err) {
      callback(err);
    });
  };

  // Create an copy when insert or update
  schema.pre('save', function (next) {
    var d = this.toObject();
    d.__v = undefined;

    var historyDoc = {};
    historyDoc['t'] = new Date();
    historyDoc['o'] = this.isNew ? 'i' : 'u';
    historyDoc['d'] = d;

    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
    history.save(next);
  });

  // Create an copy when delete
  schema.post('findOneAndDelete', function (result) {
    if (result) {
      var d = result.toObject();
      d.__v = undefined;

      var historyDoc = {};
      historyDoc['t'] = new Date();
      historyDoc['o'] = 'r';
      historyDoc['d'] = d;

      var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
      history.save();
    }
    return;
  });

  // Create an copy when update. Added to deal with findOneAndUpdate.
  schema.post('findOneAndUpdate', function (result) {
    if (result) {
      var d = result.toObject();
      d.__v = undefined;

      var historyDoc = {};
      historyDoc['t'] = new Date();
      historyDoc['o'] = 'u';
      historyDoc['d'] = d;

      var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
      history.save();
    }
    return;
  });

  //Retrieve chnage history for request.
  schema.statics.findAllHistoryForPetById = function (petId, start, end, callback) {
    var History = hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options);
    History.aggregate([{
      $match: {
        'd._id': petId, "d.createdAt": { "$gte": start.toDate(), "$lt": end.toDate() }
      }
    }, {
      $unwind: '$d'
    }, {
      $match: { 'd._id': petId }
    }, {
      $project: {
        id: '$d._id',
        transmitterId: '$d.transmitterId',
        ownerId: '$d.ownerId',
        name: '$d.name',
        loc: '$d.loc',
        last_updated_user: '$d.last_updated_user'
      }
    }], function (err, results) {

      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  }
};
